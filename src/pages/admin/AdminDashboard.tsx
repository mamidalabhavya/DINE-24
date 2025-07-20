
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, Users, ShoppingCart, Calendar, IndianRupee, Utensils, Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }
      return data;
    }
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['admin-menu-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');
      
      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
      return data;
    }
  });

  const { data: todaysSpecials, isLoading: specialsLoading } = useQuery({
    queryKey: ['admin-specials-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todays_specials')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching specials:', error);
        throw error;
      }
      return data;
    }
  });

  const { data: reservationItems, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservation_items')
        .select('*, reservations(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reservation items:', error);
        throw error;
      }
      return data;
    }
  });

  if (reservationsLoading || menuLoading || ordersLoading || specialsLoading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-royal-gold text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const totalReservations = reservations?.length || 0;
  const totalOrders = reservationItems?.length || 0;
  const totalRevenue = reservations?.reduce((sum, res) => sum + (res.total_amount || 0), 0) || 0;
  const totalMenuItems = menuItems?.length || 0;
  const activeSpecials = todaysSpecials?.length || 0;

  const latestBookings = reservations?.slice(0, 5) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const quickActions = [
    {
      title: "View All Reservations",
      description: "Check all customer reservations",
      icon: Calendar,
      path: "/admin/reservations",
      color: "bg-blue-500"
    },
    {
      title: "Update Menu",
      description: "Add or modify menu items",
      icon: Utensils,
      path: "/admin/menu",
      color: "bg-purple-500"
    },
    {
      title: "Manage Today's Special",
      description: "Set daily specials and offers",
      icon: Gift,
      path: "/admin/special",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-royal-gold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening at Dine 24 today.
            </p>
          </div>
          <Button className="btn-royal">
            Generate Report
          </Button>
        </div>

        {/* Stats Cards - Updated to 5 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="card-royal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reservations
              </CardTitle>
              <Calendar className="h-6 w-6 text-royal-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-gold">{totalReservations}</div>
            </CardContent>
          </Card>

          <Card className="card-royal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-6 w-6 text-royal-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-gold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="card-royal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-6 w-6 text-royal-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-gold">₹{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="card-royal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Menu Items
              </CardTitle>
              <Utensils className="h-6 w-6 text-royal-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-gold">{totalMenuItems}</div>
            </CardContent>
          </Card>

          <Card className="card-royal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Specials
              </CardTitle>
              <Gift className="h-6 w-6 text-royal-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-royal-gold">{activeSpecials}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Latest Bookings */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="font-playfair text-xl font-semibold text-royal-gold">Latest Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {latestBookings.length > 0 ? (
                <div className="space-y-4">
                  {latestBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-semibold text-royal-gold">{booking.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Table {booking.table_number} • {booking.num_people} people • {booking.arrival_time}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No reservations yet</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="font-playfair text-xl font-semibold text-royal-gold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Button className="w-full justify-start" variant="outline">
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="card-royal">
          <CardHeader>
            <CardTitle className="font-playfair text-xl font-semibold text-royal-gold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {reservations && reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.slice(0, 4).map((reservation, index) => (
                  <div key={reservation.id} className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New reservation from {reservation.full_name} for Table {reservation.table_number}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(reservation.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
