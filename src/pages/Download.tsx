
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon, Clock } from "lucide-react";
import Container from "@/components/ui/container";
import { useToast } from "@/components/ui/use-toast";

const Download = () => {
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the token from the URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid download link. Please try again.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    // Fetch the purchase data to validate the token
    const fetchPurchase = async () => {
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('*')
          .eq('download_token', token)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setIsExpired(true);
          setIsLoading(false);
          return;
        }
        
        // Check if token is expired
        const expiresAt = new Date(data.token_expires_at);
        if (expiresAt < new Date()) {
          setIsExpired(true);
          setIsLoading(false);
          return;
        }
        
        setPurchaseData(data);
        
        // Calculate remaining time
        const remainingMs = expiresAt.getTime() - new Date().getTime();
        const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
        setTimeLeft(remainingSec);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching download data:", error);
        toast({
          title: "Error",
          description: "Failed to validate download token. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };
    
    fetchPurchase();
  }, [location, navigate, toast]);
  
  // Countdown timer
  useEffect(() => {
    if (isLoading || isExpired) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLoading, isExpired]);
  
  const handleDownload = async () => {
    if (!purchaseData) return;
    
    try {
      // Get the token to pass as a query parameter
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      
      // Create a signed URL with the token
      const { data, error } = await supabase.storage
        .from('ebook_storage')
        .createSignedUrl('ebook_decision_dynamo.pdf', 300, { 
          download: true,
          transform: { 
            quality: 100 
          }
        });
        
      if (error) throw error;
      
      if (!data?.signedUrl) {
        throw new Error("Could not generate download URL");
      }
      
      // Open the download in a new tab
      window.open(data.signedUrl, '_blank');
      
      toast({
        title: "Download started",
        description: "Your eBook download has started!",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your eBook. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your download...</p>
        </div>
      </div>
    );
  }
  
  if (isExpired) {
    return (
      <div className="min-h-screen py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Download Link Expired</h1>
            <p className="mb-8">This download link has expired. Please contact support if you need assistance.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Your eBook is Ready!</h1>
          
          <div className="flex items-center justify-center space-x-2 mb-8 text-amber-600">
            <Clock className="h-5 w-5" />
            <p>
              This link expires in <span className="font-bold">{formatTime(timeLeft)}</span>
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8 text-center">
            <p className="text-amber-800">
              This download link is valid for 5 minutes only. Please download your eBook now.
            </p>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              className="px-10 py-6 rounded-full text-base"
              onClick={handleDownload}
            >
              <DownloadIcon className="mr-2 h-5 w-5" />
              Download eBook Now
            </Button>
            
            <p className="text-sm text-muted-foreground mt-6">
              Thank you for your purchase! If you encounter any issues, please contact our support.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Download;
