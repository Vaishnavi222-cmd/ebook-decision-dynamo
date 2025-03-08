
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { corsHeaders } from "../_shared/cors.ts";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  console.log("verify-payment function called");
  
  // Configuration debug logging
  console.log("RAZORPAY_KEY_SECRET:", RAZORPAY_KEY_SECRET ? "Loaded" : "MISSING");
  console.log("Supabase URL:", supabaseUrl ? "Loaded" : "MISSING");
  console.log("Supabase Service Key:", supabaseServiceKey ? "Loaded" : "MISSING");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay Key Secret");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const requestData = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, purchase_id } = requestData;
    
    console.log("Payment verification request received", { 
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      has_signature: !!razorpay_signature,
      purchase_id: purchase_id
    });
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !purchase_id) {
      console.error("Missing payment details", requestData);
      return new Response(JSON.stringify({ error: "Missing payment details" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify payment signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const hmac = createHmac("sha256", RAZORPAY_KEY_SECRET as string);
    const encodedPayload = await hmac.update(new TextEncoder().encode(payload)).digest();
    const generatedSignature = Array.from(new Uint8Array(encodedPayload))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Log signatures for debugging
    console.log("Received Signature:", razorpay_signature);
    console.log("Generated Signature (first 10 chars):", generatedSignature.substring(0, 10) + "...");
    
    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      console.error("Invalid payment signature", {
        provided: razorpay_signature,
        calculated: generatedSignature.substring(0, 10) + "..." // Log partial signature for debugging
      });
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Payment signature verification successful");

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    try {
      // Get the purchase record first to check if it exists
      const { data: purchaseRecord, error: fetchError } = await supabase
        .from('purchases')
        .select('*')
        .eq('id', purchase_id)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error fetching purchase record:", fetchError.message);
        throw fetchError;
      }
      
      if (!purchaseRecord) {
        console.error("Purchase record not found for ID:", purchase_id);
        return new Response(JSON.stringify({ error: "Purchase record not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }
      
      // Verify that the order ID matches
      if (purchaseRecord.razorpay_order_id && purchaseRecord.razorpay_order_id !== razorpay_order_id) {
        console.error("Order ID mismatch", {
          stored: purchaseRecord.razorpay_order_id,
          received: razorpay_order_id
        });
        return new Response(JSON.stringify({ error: "Order ID verification failed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      // Generate a random download token
      const downloadToken = crypto.randomUUID();
      
      // Update the existing purchase record with payment details and generate download token
      const { data, error } = await supabase
        .from('purchases')
        .update({ 
          payment_id: razorpay_payment_id,
          payment_status: 'completed',
          razorpay_order_id: razorpay_order_id, // Ensure order ID is stored if it wasn't before
          download_token: downloadToken,
          // Set token expiration to 5 minutes from now
          token_expires_at: new Date(new Date().getTime() + 5 * 60 * 1000).toISOString()
        })
        .eq('id', purchase_id)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase database error:", error.message, error.details);
        throw error;
      }
      
      console.log("Purchase record updated successfully. Token:", data.download_token);
      
      return new Response(JSON.stringify({ 
        success: true,
        download_token: data.download_token
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (dbError) {
      console.error("Database error:", dbError.message, dbError.details);
      return new Response(JSON.stringify({ 
        error: "Database error",
        message: dbError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message, error.stack);
    return new Response(JSON.stringify({ 
      error: "Failed to verify payment",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
