
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Load Razorpay key values from environment
const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_M1QTLNp0XmKPSi";
const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

// Constants
const AMOUNT = 19900; // Amount in paise (₹199)
const CURRENCY = "INR";

serve(async (req) => {
  console.log("-----------------------------------");
  console.log("create-order function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request - responding with CORS headers");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Creating order with Razorpay: amount=" + AMOUNT + ", currency=" + CURRENCY);
    
    // Create a Razorpay order
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${KEY_ID}:${KEY_SECRET}`)}`
      },
      body: JSON.stringify({
        amount: AMOUNT,
        currency: CURRENCY,
        receipt: `receipt_${Date.now()}`
      })
    });

    // Check if the order creation was successful
    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error("Razorpay error:", errorData);
      throw new Error(`Razorpay API error: ${errorData.error?.description || 'Unknown error'}`);
    }
    
    const orderData = await orderResponse.json();
    console.log("Order created successfully:", orderData);
    
    // Prepare client response
    const clientResponse = {
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key: KEY_ID,
    };
    
    console.log("Sending successful response to client:", JSON.stringify(clientResponse));
    
    return new Response(JSON.stringify(clientResponse), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in order creation:", error.message);
    
    return new Response(JSON.stringify({ 
      error: "Order creation failed",
      message: error.message
    }), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});
