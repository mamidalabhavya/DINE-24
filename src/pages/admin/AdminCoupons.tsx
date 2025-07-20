import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Plus, Edit, Trash } from "lucide-react";

const AdminCoupons = () => {
  const coupons = [
    {
      id: 1,
      name: "ROYAL20",
      orderWorth: 500,
      discount: "20%",
      discountType: "percentage",
      validTill: "2024-02-28",
      usageCount: 45,
      maxUsage: 100,
      status: "active"
    },
    {
      id: 2,
      name: "FIRST100",
      orderWorth: 300,
      discount: "₹100",
      discountType: "fixed",
      validTill: "2024-02-15",
      usageCount: 23,
      maxUsage: 50,
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-great-vibes text-4xl font-bold text-royal-gold">
            Coupon Management
          </h1>
          <Button className="btn-royal">
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Coupon Form */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="text-royal-subtitle">Create New Coupon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Coupon Code</Label>
                <Input className="royal-border" placeholder="e.g., SAVE20" />
              </div>
              <div>
                <Label>Min Order Worth (₹)</Label>
                <Input type="number" className="royal-border" placeholder="500" />
              </div>
              <div>
                <Label>Discount</Label>
                <Input className="royal-border" placeholder="20% or ₹100" />
              </div>
              <div>
                <Label>Valid Till</Label>
                <Input type="date" className="royal-border" />
              </div>
              <Button className="btn-royal w-full">
                Create Coupon
              </Button>
            </CardContent>
          </Card>

          {/* Existing Coupons */}
          <div className="lg:col-span-2 space-y-6">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className="card-royal">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Gift className="h-5 w-5 text-royal-gold" />
                        <h3 className="font-bold text-royal-gold text-lg">{coupon.name}</h3>
                        <Badge className={coupon.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                          {coupon.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Min order: ₹{coupon.orderWorth} | Discount: {coupon.discount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valid till: {coupon.validTill}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" className="royal-border">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="border-red-500 text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-royal-gold">{coupon.usageCount}</p>
                      <p className="text-xs text-muted-foreground">Times Used</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-royal-gold">{coupon.maxUsage - coupon.usageCount}</p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-royal-gold h-2 rounded-full" 
                        style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {Math.round((coupon.usageCount / coupon.maxUsage) * 100)}% used
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
