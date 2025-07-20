
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Gift, Calendar, Percent, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CustomerCoupons = () => {
  const navigate = useNavigate();
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const customerAuth = localStorage.getItem("customerAuth");
    if (customerAuth !== "true") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Mock coupons data
  const availableCoupons = [
    {
      code: "ROYAL20",
      name: "Royal Feast Discount",
      discount: "20% OFF",
      minOrder: 500,
      validTill: "2024-02-28",
      description: "Get 20% off on orders above ₹500",
      status: "active"
    },
    {
      code: "FIRST100",
      name: "First Order Special",
      discount: "₹100 OFF",
      minOrder: 300,
      validTill: "2024-02-15",
      description: "Flat ₹100 off on your first order",
      status: "active"
    },
    {
      code: "FAMILY50",
      name: "Family Pack Deal",
      discount: "₹50 OFF",
      minOrder: 800,
      validTill: "2024-03-15",
      description: "Special discount for family dining",
      status: "active"
    }
  ];

  const usedCoupons = [
    {
      code: "WELCOME25",
      name: "Welcome Bonus",
      discount: "25% OFF",
      usedOn: "2024-01-15",
      savedAmount: 250,
      status: "used"
    },
    {
      code: "BIRTHDAY30",
      name: "Birthday Special",
      discount: "30% OFF",
      usedOn: "2024-01-10",
      savedAmount: 180,
      status: "used"
    }
  ];

  const expiredCoupons = [
    {
      code: "NEWYEAR15",
      name: "New Year Celebration",
      discount: "15% OFF",
      expiredOn: "2024-01-31",
      status: "expired"
    }
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const getCouponStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500 text-white";
      case "used": return "bg-blue-500 text-white";
      case "expired": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="h-12 w-12 text-royal-gold mx-auto mb-4" />
          <h1 className="font-great-vibes text-4xl font-bold text-royal-gold mb-2">
            My Coupons
          </h1>
          <p className="text-muted-foreground">Your exclusive offers and discounts</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Available Coupons */}
          <div>
            <h2 className="text-2xl font-bold text-royal-gold mb-6 flex items-center">
              <Gift className="h-6 w-6 mr-2" />
              Available Coupons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCoupons.map((coupon) => (
                <Card key={coupon.code} className="card-royal relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-royal-gold/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-royal-gold text-lg">{coupon.name}</CardTitle>
                        <Badge className={getCouponStatusColor(coupon.status)} >
                          Active
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-royal-gold">{coupon.discount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-royal-gold p-3 rounded-lg bg-royal-gold/5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-royal-gold text-lg">{coupon.code}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedCoupon === coupon.code ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{coupon.description}</p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Order:</span>
                        <span className="font-semibold">₹{coupon.minOrder}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valid Till:</span>
                        <span className="font-semibold flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {coupon.validTill}
                        </span>
                      </div>
                    </div>
                    
                    <Button className="btn-royal w-full">
                      Use Coupon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Used Coupons */}
          <div>
            <h2 className="text-2xl font-bold text-muted-foreground mb-6 flex items-center">
              <Percent className="h-6 w-6 mr-2" />
              Recently Used
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {usedCoupons.map((coupon) => (
                <Card key={coupon.code} className="card-royal opacity-75">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-muted-foreground">{coupon.name}</CardTitle>
                        <Badge className={getCouponStatusColor(coupon.status)}>
                          Used
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-muted-foreground">{coupon.discount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Code:</span>
                      <span className="font-mono">{coupon.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Used On:</span>
                      <span>{coupon.usedOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You Saved:</span>
                      <span className="font-bold text-green-600">₹{coupon.savedAmount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Expired Coupons */}
          <div>
            <h2 className="text-2xl font-bold text-muted-foreground mb-6">
              Expired Coupons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredCoupons.map((coupon) => (
                <Card key={coupon.code} className="card-royal opacity-50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-muted-foreground">{coupon.name}</CardTitle>
                        <Badge className={getCouponStatusColor(coupon.status)}>
                          Expired
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-muted-foreground">{coupon.discount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expired On:</span>
                      <span>{coupon.expiredOn}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            className="royal-border"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCoupons;
