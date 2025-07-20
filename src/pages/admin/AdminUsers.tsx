
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, Mail, Phone, MapPin } from "lucide-react";

const AdminUsers = () => {
  const users = [
    {
      username: "priya_sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      address: "Banjara Hills, Hyderabad",
      totalOrders: 12,
      lastOrderAmount: 450,
      joinDate: "2024-01-15",
      status: "active"
    },
    {
      username: "rajesh_kumar",
      email: "rajesh.k@email.com", 
      phone: "+91 87654 32109",
      address: "Jubilee Hills, Hyderabad",
      totalOrders: 8,
      lastOrderAmount: 320,
      joinDate: "2024-02-03",
      status: "active"
    },
    {
      username: "sneha_patel",
      email: "sneha.patel@email.com",
      phone: "+91 76543 21098",
      address: "Gachibowli, Hyderabad",
      totalOrders: 5,
      lastOrderAmount: 280,
      joinDate: "2024-02-20",
      status: "inactive"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-great-vibes text-4xl font-bold text-royal-gold">
            User Management
          </h1>
          <Button className="btn-royal">
            Export Users
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="card-royal mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or phone..."
                className="pl-10 royal-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-6">
          {users.map((user, index) => (
            <Card key={index} className="card-royal">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-royal-gradient rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-royal-gold text-lg">{user.username}</h3>
                        <Badge className={user.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-royal-gold" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-royal-gold" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-royal-gold" />
                        <span>{user.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-semibold text-royal-gold mb-2">Order Stats</h4>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-royal-gold">{user.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-lg font-semibold">₹{user.lastOrderAmount}</p>
                      <p className="text-xs text-muted-foreground">Last Order</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-2">
                    <Button className="btn-royal">
                      View Details
                    </Button>
                    <Button variant="outline" className="royal-border">
                      Order History
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Joined: {user.joinDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
