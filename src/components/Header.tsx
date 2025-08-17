
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Phone, Settings, LogIn,Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const isAdminLoggedIn = localStorage.getItem("adminAuth") === "true";

  const handleReserveTable = () => {
    navigate("/reserve-table");
  };

  const handleAdminLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-background via-royal-gold/5 to-background border-b-2 border-royal-gold/30 sticky top-0 z-50 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-royal-gold drop-shadow-md" />
             <span className="font-great-vibes text-3xl font-bold text-royal-gold drop-shadow-lg">
               Dine 24
              </span>
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-muted-foreground hover:text-royal-gold transition-colors font-medium">
              About Restaurant
            </Link>
            <Link to="/services" className="text-muted-foreground hover:text-royal-gold transition-colors font-medium">
              Our Services
            </Link>
            <Link to="/menu" className="text-muted-foreground hover:text-royal-gold transition-colors font-medium">
              Our Dishes
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-royal-gold transition-colors font-medium">
              Contact Us
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hover:bg-royal-gold/10 border border-royal-gold/20"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-royal-gold" />
              ) : (
                <Sun className="h-5 w-5 text-royal-gold" />
              )}
            </Button>

            {/* Reserve Table Button */}
            <Button 
              onClick={handleReserveTable}
              className="btn-royal hidden md:inline-flex shadow-md"
            >
              Reserve Table
            </Button>

            {/* Admin Login Button */}
            <Button 
              onClick={handleAdminLogin}
              variant="outline"
              className="hidden md:inline-flex border-royal-gold/50 text-royal-gold hover:bg-royal-gold/10 shadow-md"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Admin Login
            </Button>


            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden border border-royal-gold/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-royal-gold" />
              ) : (
                <Menu className="h-6 w-6 text-royal-gold" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-gradient-to-b from-royal-gold/5 to-transparent rounded-b-lg">
            <Link
              to="/about"
              className="block py-2 text-muted-foreground hover:text-royal-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Restaurant
            </Link>
            <Link
              to="/services"
              className="block py-2 text-muted-foreground hover:text-royal-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Services
            </Link>
            <Link
              to="/menu"
              className="block py-2 text-muted-foreground hover:text-royal-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Dishes
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-muted-foreground hover:text-royal-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => {
                  handleReserveTable();
                  setIsMenuOpen(false);
                }}
                className="btn-royal w-full"
              >
                Reserve Table
              </Button>
              <Button 
                onClick={() => {
                  handleAdminLogin();
                  setIsMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-royal-gold/50 text-royal-gold hover:bg-royal-gold/10"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
              {!isAdminLoggedIn ? (
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              ) : (
                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
