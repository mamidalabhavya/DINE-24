
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Calendar, Users, Clock, Receipt, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ReservationHistory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const customerAuth = localStorage.getItem("customerAuth");
    if (customerAuth !== "true") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Mock reservation history data
  const reservationHistory = [
    {
      id: "RES-001",
      date: "2024-01-20",
      time: "19:30",
      table: "B3",
      people: 4,
      purpose: "Family",
      status: "Completed",
      totalBill: 1250,
      orderedItems: ["Hyderabadi Biryani", "Paneer Butter Masala", "Gulab Jamun", "Lassi"],
      paymentMode: "Online"
    },
    {
      id: "RES-002", 
      date: "2024-01-15",
      time: "13:00",
      table: "A2",
      people: 2,
      purpose: "Romantic",
      status: "Completed",
      totalBill: 800,
      orderedItems: ["Masala Dosa", "Filter Coffee"],
      paymentMode: "Cash"
    },
    {
      id: "RES-003",
      date: "2024-01-25",
      time: "20:00", 
      table: "PC5",
      people: 8,
      purpose: "Corporate",
      status: "Upcoming",
      totalBill: 0,
      orderedItems: [],
      paymentMode: "Pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500 text-white";
      case "Upcoming": return "bg-blue-500 text-white";
      case "Cancelled": return "bg-red-500 text-white";
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
            Reservation History
          </h1>
          <p className="text-muted-foreground">View all your past and upcoming reservations</p>
        </div>

        {/* Reservation Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {reservationHistory.map((reservation) => (
            <Card key={reservation.id} className="card-royal">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <CardTitle className="text-royal-gold">{reservation.id}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {reservation.date} at {reservation.time}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(reservation.status)}>
                  {reservation.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-royal-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Table</p>
                      <p className="font-semibold">{reservation.table}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-royal-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">People</p>
                      <p className="font-semibold">{reservation.people} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-royal-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Purpose</p>
                      <p className="font-semibold">{reservation.purpose}</p>
                    </div>
                  </div>
                </div>

                {/* Ordered Items */}
                {reservation.orderedItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-royal-gold mb-2 flex items-center">
                      <Receipt className="h-4 w-4 mr-2" />
                      Ordered Items
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {reservation.orderedItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="border-royal-gold text-royal-gold">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bill Information */}
                {reservation.status === "Completed" && (
                  <div className="flex justify-between items-center pt-4 border-t border-muted">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Mode</p>
                      <p className="font-semibold">{reservation.paymentMode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Bill</p>
                      <p className="text-2xl font-bold text-royal-gold">₹{reservation.totalBill}</p>
                    </div>
                  </div>
                )}

                {/* Actions for Upcoming Reservations */}
                {reservation.status === "Upcoming" && (
                  <div className="flex gap-4 pt-4 border-t border-muted">
                    <Button className="btn-royal">
                      Modify Reservation
                    </Button>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                      Cancel Reservation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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

export default ReservationHistory;
