
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_M1QTLNp0XmKPSi";
const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

serve(async (req) => {
  console.log("verify-payment function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = requestData;
    
    console.log("Payment verification request received", { 
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      has_signature: !!razorpay_signature
    });
    
    // Verify payment with Razorpay
    const verificationResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${KEY_ID}:${KEY_SECRET}`)}`
      }
    });

    if (!verificationResponse.ok) {
      const errorData = await verificationResponse.json();
      throw new Error(`Payment verification failed: ${errorData.error?.description || 'Unknown error'}`);
    }

    const paymentData = await verificationResponse.json();
    
    if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
      throw new Error(`Payment not successful. Status: ${paymentData.status}`);
    }
    
    // Generate a download token
    const downloadToken = crypto.randomUUID();
    
    // Store the purchase record in Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      // Calculate expiry time (5 minutes from now)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);
      
      // Insert purchase record
      const { error: insertError } = await supabase
        .from('purchases')
        .insert({
          payment_id: razorpay_payment_id,
          amount: paymentData.amount,
          payment_status: paymentData.status,
          download_token: downloadToken,
          token_expires_at: expiryTime.toISOString()
        });
      
      if (insertError) {
        console.error("Error storing purchase record:", insertError);
        // Continue anyway, don't block the user from downloading
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      download_token: downloadToken
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in payment verification:", error.message);
    return new Response(JSON.stringify({ 
      error: "Verification failed",
      message: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
