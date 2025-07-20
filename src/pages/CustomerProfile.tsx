
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Crown, Save, Edit, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    username: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const customerAuth = localStorage.getItem("customerAuth");
    if (customerAuth !== "true") {
      navigate("/login");
      return;
    }

    // Load profile data from localStorage
    setProfileData({
      fullName: localStorage.getItem("customerFullName") || "Customer",
      email: localStorage.getItem("customerEmail") || "",
      phone: localStorage.getItem("customerPhone") || "",
      address: localStorage.getItem("customerAddress") || "",
      username: localStorage.getItem("customerUsername") || "",
    });
  }, [navigate]);

  const handleSave = () => {
    // Update localStorage with new data
    localStorage.setItem("customerFullName", profileData.fullName);
    localStorage.setItem("customerEmail", profileData.email);
    localStorage.setItem("customerPhone", profileData.phone);
    localStorage.setItem("customerAddress", profileData.address);
    
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    // Reload original data
    setProfileData({
      fullName: localStorage.getItem("customerFullName") || "Customer",
      email: localStorage.getItem("customerEmail") || "",
      phone: localStorage.getItem("customerPhone") || "",
      address: localStorage.getItem("customerAddress") || "",
      username: localStorage.getItem("customerUsername") || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="h-12 w-12 text-royal-gold mx-auto mb-4" />
          <h1 className="font-great-vibes text-4xl font-bold text-royal-gold mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <Card className="card-royal">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-royal-subtitle">Profile Information</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="btn-royal">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="btn-royal">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="royal-border">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="flex items-center text-royal-gold">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                className="royal-border"
                disabled={!isEditing}
              />
            </div>

            {/* Username (Non-editable) */}
            <div className="space-y-2">
              <Label className="flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                Username (Cannot be changed)
              </Label>
              <Input
                value={profileData.username}
                className="royal-border bg-muted"
                disabled
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center text-royal-gold">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="royal-border"
                disabled={!isEditing}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="flex items-center text-royal-gold">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </Label>
              <Input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="royal-border"
                disabled={!isEditing}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="flex items-center text-royal-gold">
                <MapPin className="h-4 w-4 mr-2" />
                Address
              </Label>
              <Input
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                className="royal-border"
                disabled={!isEditing}
              />
            </div>

            {/* Account Security Note */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold text-royal-gold mb-2">Account Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Username cannot be changed for security reasons</li>
                <li>• Contact support for password changes</li>
                <li>• Keep your contact information updated for security alerts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

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

export default CustomerProfile;
