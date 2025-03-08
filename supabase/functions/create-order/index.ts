
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Test mode constants
const TEST_KEY_ID = "rzp_test_M1QTLNp0XmKPSi"; // Test key
const AMOUNT = 19900; // Amount in paise (₹199)
const CURRENCY = "INR";

serve(async (req) => {
  console.log("-----------------------------------");
  console.log("create-order function called in TEST MODE with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request - responding with CORS headers");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Creating test order with Razorpay: amount=" + AMOUNT + ", currency=" + CURRENCY);
    
    // In test mode, we create a simple order object without calling Razorpay API
    // This is ONLY for development and testing!
    const orderId = `order_test_${Date.now()}`;
    
    // Prepare client response with test data - NO JWT CHECK
    const clientResponse = {
      id: orderId,
      amount: AMOUNT,
      currency: CURRENCY,
      key: TEST_KEY_ID,
    };
    
    console.log("Sending successful test response to client:", JSON.stringify(clientResponse));
    
    return new Response(JSON.stringify(clientResponse), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in test order creation:", error.message);
    
    return new Response(JSON.stringify({ 
      error: "Test order creation failed",
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
