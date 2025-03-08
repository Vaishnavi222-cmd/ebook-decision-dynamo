
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  console.log("verify-payment function called (TEST MODE)");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = requestData;
    
    console.log("Payment verification request received in TEST MODE", { 
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      has_signature: !!razorpay_signature
    });
    
    // In test mode, we simply accept the payment without verification
    // NO JWT CHECK - Simple implementation
    
    // Generate a random download token
    const downloadToken = crypto.randomUUID();
    
    return new Response(JSON.stringify({ 
      success: true,
      download_token: downloadToken,
      test_mode: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in test payment verification:", error.message);
    return new Response(JSON.stringify({ 
      error: "Test verification failed",
      message: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
