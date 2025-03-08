
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { corsHeaders } from "../_shared/cors.ts";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
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
    
    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create a new purchase record with download token
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        { 
          amount: 180, // Amount in rupees
          payment_id: razorpay_payment_id,
          payment_status: 'completed',
          // Set token expiration to 5 minutes from now
          token_expires_at: new Date(new Date().getTime() + 5 * 60 * 1000).toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      download_token: data.download_token
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: "Failed to verify payment" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
