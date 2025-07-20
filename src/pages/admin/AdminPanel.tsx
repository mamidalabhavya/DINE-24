
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Menu, 
  Star, 
  Calendar, 
  ShoppingCart, 
  Gift,
  Crown
} from "lucide-react";

const AdminPanel = () => {
  const adminMenuItems = [
    {
      title: "Dashboard",
      description: "Overview of restaurant statistics and performance",
      icon: <LayoutDashboard className="h-8 w-8 text-royal-gold" />,
      link: "/admin/dashboard"
    },
    {
      title: "Users",
      description: "Manage customer accounts and information",
      icon: <Users className="h-8 w-8 text-royal-gold" />,
      link: "/admin/users"
    },
    {
      title: "Menu Management",
      description: "Add, edit, and organize menu items",
      icon: <Menu className="h-8 w-8 text-royal-gold" />,
      link: "/admin/menu"
    },
    {
      title: "Today's Special",
      description: "Set and manage daily special dishes",
      icon: <Star className="h-8 w-8 text-royal-gold" />,
      link: "/admin/special"
    },
    {
      title: "Reservations",
      description: "View and manage table bookings",
      icon: <Calendar className="h-8 w-8 text-royal-gold" />,
      link: "/admin/reservations"
    },
    {
      title: "Orders",
      description: "Track and manage customer orders",
      icon: <ShoppingCart className="h-8 w-8 text-royal-gold" />,
      link: "/admin/orders"
    },
    {
      title: "Coupons",
      description: "Create and manage discount coupons",
      icon: <Gift className="h-8 w-8 text-royal-gold" />,
      link: "/admin/coupons"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Crown className="h-16 w-16 text-royal-gold mx-auto mb-4 animate-glow" />
          <h1 className="font-great-vibes text-6xl font-bold text-royal-gold mb-4">
            Admin Panel
          </h1>
          <p className="font-playfair text-xl text-muted-foreground">
            Manage your royal restaurant with ease
          </p>
        </div>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminMenuItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <Card className="card-royal hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-royal-subtitle">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-royal text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-royal-gold">156</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Total Customers</p>
            </CardContent>
          </Card>
          <Card className="card-royal text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-royal-gold">42</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Menu Items</p>
            </CardContent>
          </Card>
          <Card className="card-royal text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-royal-gold">28</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Today's Orders</p>
            </CardContent>
          </Card>
          <Card className="card-royal text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-royal-gold">₹45,320</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Today's Revenue</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
