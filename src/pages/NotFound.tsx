
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find the page you were looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Home size={18} />
              <span>Return to Home</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </Button>
        </div>
        <div className="mt-8 text-gray-500">
          <p>Looking for something specific?</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Link to="/disclaimer" className="text-blue-600 hover:underline px-2">Disclaimer</Link>
            <Link to="/terms" className="text-blue-600 hover:underline px-2">Terms</Link>
            <Link to="/privacy" className="text-blue-600 hover:underline px-2">Privacy</Link>
            <Link to="/refund" className="text-blue-600 hover:underline px-2">Refund</Link>
            <Link to="/contact" className="text-blue-600 hover:underline px-2">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
