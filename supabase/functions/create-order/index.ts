
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
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
    // Check API keys
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("ERROR: Missing Razorpay API keys");
      console.log("RAZORPAY_KEY_ID exists:", !!RAZORPAY_KEY_ID);
      console.log("RAZORPAY_KEY_SECRET exists:", !!RAZORPAY_KEY_SECRET);
      
      return new Response(JSON.stringify({ 
        error: "Server configuration error", 
        message: "Razorpay API keys are not configured properly"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("Creating order with Razorpay: amount=" + AMOUNT + ", currency=" + CURRENCY);
    
    // Prepare request data
    const orderData = {
      amount: AMOUNT,
      currency: CURRENCY,
      receipt: `receipt_${Date.now()}`,
      notes: {
        product: "Decision Dynamo eBook"
      }
    };
    
    console.log("Order request payload:", JSON.stringify(orderData));
    
    // Create order in Razorpay
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
      },
      body: JSON.stringify(orderData),
    });

    // Log response status
    console.log("Razorpay API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      console.error("Razorpay API error:", response.status, JSON.stringify(errorData));
      
      return new Response(JSON.stringify({ 
        error: "Razorpay API error", 
        status: response.status,
        details: errorData
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.status,
      });
    }

    const order = await response.json();
    console.log("Order created successfully. Order ID:", order.id);
    
    // Prepare client response
    const clientResponse = {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID
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
    console.error("Critical error creating Razorpay order:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: "Failed to create order",
      message: error.message,
      stack: error.stack
    }), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});
