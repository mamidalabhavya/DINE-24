
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <Crown className="h-24 w-24 text-royal-gold mx-auto mb-6 animate-glow" />
        <h1 className="font-great-vibes text-8xl font-bold text-royal-gold mb-4">404</h1>
        <h2 className="font-playfair text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you've wandered off the royal path. Let us guide you back to the feast!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="btn-royal">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="royal-border">
              View Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
