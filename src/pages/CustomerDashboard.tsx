
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { 
  Crown, 
  Menu, 
  Star, 
  Calendar, 
  Gift, 
  History, 
  User, 
  LogOut,
  Clock,
  MapPin
} from "lucide-react";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const customerName = localStorage.getItem("customerFullName") || localStorage.getItem("customerUsername") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("customerAuth");
    localStorage.removeItem("customerUsername");
    localStorage.removeItem("customerFullName");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("customerAddress");
    navigate("/");
  };

  const dashboardStats = [
    { title: "Total Visits", value: "12", icon: <History className="h-6 w-6" /> },
    { title: "Loyalty Points", value: "2,450", icon: <Star className="h-6 w-6" /> },
    { title: "Active Coupons", value: "3", icon: <Gift className="h-6 w-6" /> },
    { title: "Reservations", value: "2", icon: <Calendar className="h-6 w-6" /> }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      items: ["Hyderabadi Biryani", "Gulab Jamun"],
      total: 300,
      status: "Completed"
    },
    {
      id: "ORD-002", 
      date: "2024-01-10",
      items: ["Paneer Butter Masala", "Naan"],
      total: 180,
      status: "Completed"
    }
  ];

  const availableCoupons = [
    {
      code: "ROYAL20",
      discount: "20% OFF",
      minOrder: "₹500",
      validTill: "2024-02-28"
    },
    {
      code: "FIRST100",
      discount: "₹100 OFF",
      minOrder: "₹300",
      validTill: "2024-02-15"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Crown className="h-10 w-10 text-royal-gold" />
            <div>
              <h1 className="font-great-vibes text-4xl font-bold text-royal-gold">
                Welcome, {customerName}!
              </h1>
              <p className="text-muted-foreground">Your royal dining dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="royal-border">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="card-royal text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto text-royal-gold mb-2">
                  {stat.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-royal-gold">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/menu">
            <Card className="card-royal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <Menu className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                <CardTitle className="text-royal-subtitle">View Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Explore our delicious dishes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/todays-special">
            <Card className="card-royal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <Star className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                <CardTitle className="text-royal-subtitle">Today's Special</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Check out chef's recommendations
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reserve-table">
            <Card className="card-royal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                <CardTitle className="text-royal-subtitle">Reserve Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Book your dining experience
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="card-royal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <User className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                <CardTitle className="text-royal-subtitle">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Update your information
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Additional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/coupons">
            <Card className="card-royal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <Gift className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                <CardTitle className="text-royal-subtitle">My Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  View available offers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reservation-history">
            <Card className="card-royal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <History className="h-8 w-8 text-royal-gold mx-auto mb-2" />
                <CardTitle className="text-royal-subtitle">My History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  View past reservations
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="card-royal">
            <CardHeader className="text-center">
              <Star className="h-8 w-8 text-royal-gold mx-auto mb-2" />
              <CardTitle className="text-royal-subtitle">Loyalty Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Earn points with every visit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Coupons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="text-royal-subtitle flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border-b border-muted pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-royal-gold">{order.id}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {order.date}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm">{order.items.join(", ")}</p>
                  </div>
                  <p className="font-semibold text-royal-gold">₹{order.total}</p>
                </div>
              ))}
              <Link to="/reservation-history">
                <Button variant="outline" className="w-full royal-border">
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Available Coupons */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="text-royal-subtitle flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Available Coupons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableCoupons.map((coupon, index) => (
                <div key={index} className="border-2 border-dashed border-royal-gold p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-royal-gold text-black font-bold">
                      {coupon.code}
                    </Badge>
                    <span className="text-royal-gold font-bold">{coupon.discount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Min order: {coupon.minOrder} | Valid till: {coupon.validTill}
                  </p>
                </div>
              ))}
              <Link to="/coupons">
                <Button className="btn-royal w-full">
                  View All Coupons
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
