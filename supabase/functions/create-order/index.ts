
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
const AMOUNT = 19900; // Amount in paise (₹199)
const CURRENCY = "INR";

serve(async (req) => {
  console.log("create-order function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay API keys");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("Creating order with Razorpay: amount=" + AMOUNT + ", currency=" + CURRENCY);
    
    // Create order in Razorpay
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
      },
      body: JSON.stringify({
        amount: AMOUNT,
        currency: CURRENCY,
        receipt: `receipt_${Date.now()}`,
        notes: {
          product: "Decision Dynamo eBook"
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Razorpay API error:", response.status, errorData);
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
    
    return new Response(JSON.stringify({ 
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID
    }), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message, error.stack);
    return new Response(JSON.stringify({ 
      error: "Failed to create order",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});
