
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Crown, Shield, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCredentials.username === "admindine24" && adminCredentials.password === "bhavyagit") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Crown className="h-16 w-16 text-royal-gold mx-auto mb-4" />
          <h1 className="font-great-vibes text-5xl font-bold text-royal-gold mb-4">
            Dine 24 Admin
          </h1>
          <p className="font-playfair text-xl text-muted-foreground">
            Administrator Access Portal
          </p>
        </div>

        {/* Admin Login */}
        <Card className="card-royal">
          <CardHeader>
            <CardTitle className="text-royal-subtitle text-center flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="Admin username"
                  className="royal-border"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Admin password"
                    className="royal-border pr-10"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="btn-royal w-full">
                Admin Sign In
              </Button>
            </form>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">
                Demo Credentials:<br />
                Username: <span className="text-royal-gold">admindine24</span><br />
                Password: <span className="text-royal-gold">bhavyagit</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
