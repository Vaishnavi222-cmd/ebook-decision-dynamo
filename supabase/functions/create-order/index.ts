
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { corsHeaders } from "../_shared/cors.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
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

    // Check Supabase credentials
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("ERROR: Missing Supabase credentials");
      console.log("SUPABASE_URL exists:", !!SUPABASE_URL);
      console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!SUPABASE_SERVICE_ROLE_KEY);
      
      return new Response(JSON.stringify({ 
        error: "Server configuration error", 
        message: "Supabase credentials are not configured properly"
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
    
    // Fix: Correctly format the authorization header
    // Format: "Basic " + btoa(RAZORPAY_KEY_ID + ":" + RAZORPAY_KEY_SECRET)
    const authHeader = "Basic " + btoa(RAZORPAY_KEY_ID + ":" + RAZORPAY_KEY_SECRET);
    console.log("Authorization header format (first 10 chars):", authHeader.substring(0, 10) + "...");
    
    // Create order in Razorpay with proper headers and mode
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(orderData),
      // Add mode: "cors" for proper CORS handling
      mode: "cors",
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

    // Validate order response - check if it contains an order ID
    if (!order.id) {
      console.error("Razorpay did not return an order ID", order);
      return new Response(JSON.stringify({ 
        error: "Order creation failed", 
        message: "Razorpay did not return a valid order ID" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    // Initialize Supabase client to store the order
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Store order in Supabase purchases table
    console.log("Storing order in Supabase...");
    const { data: purchaseData, error: purchaseError } = await supabase
      .from("purchases")
      .insert([
        {
          payment_id: null, // Will be updated after payment completion
          amount: order.amount / 100, // Convert from paise to rupees
          payment_status: "created",
          download_token: null, // Will be generated after successful payment
          token_expires_at: null // Will be set after successful payment
        }
      ])
      .select()
      .single();
    
    // Check if there was an error saving to Supabase
    if (purchaseError) {
      console.error("Supabase Order Insert Failed:", purchaseError);
      return new Response(JSON.stringify({ 
        error: "Order storage failed", 
        message: purchaseError.message,
        details: purchaseError
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    console.log("Order stored in Supabase successfully. Purchase ID:", purchaseData.id);
    
    // Prepare client response
    const clientResponse = {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
      purchase_id: purchaseData.id
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
