
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown } from "lucide-react";

interface ReservationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const ReservationForm = ({ onSubmit, isLoading }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    numPeople: "",
    purpose: "",
    arrivalTime: "",
    arrivalDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone
    if (formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="card-royal">
      <CardHeader className="text-center">
        <Crown className="h-8 w-8 text-royal-gold mx-auto mb-2" />
        <CardTitle className="text-royal-subtitle">Reservation Details</CardTitle>
        <p className="text-sm text-muted-foreground">Fill in your details to reserve a table</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              className="royal-border"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="royal-border"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="royal-border"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numPeople">Number of People *</Label>
            <Input
              id="numPeople"
              type="number"
              min="1"
              max="20"
              placeholder="Enter number of guests"
              className="royal-border"
              value={formData.numPeople}
              onChange={(e) => setFormData({...formData, numPeople: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit *</Label>
            <Select onValueChange={(value) => setFormData({...formData, purpose: value})}>
              <SelectTrigger className="royal-border">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family Dining</SelectItem>
                <SelectItem value="corporate">Corporate Meeting</SelectItem>
                <SelectItem value="casual">Casual Dining</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="romantic">Romantic Dinner</SelectItem>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalDate">Date of Arrival *</Label>
            <Input
              id="arrivalDate"
              type="date"
              className="royal-border"
              value={formData.arrivalDate}
              onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Time of Arrival *</Label>
            <Input
              id="arrivalTime"
              type="time"
              className="royal-border"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="btn-royal w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Find Available Tables"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReservationForm;
