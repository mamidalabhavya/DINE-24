
import { Link } from "react-router-dom";
import { Crown, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-royal-black border-t-2 border-royal-gold text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-royal-gold" />
              <span className="font-great-vibes text-2xl font-bold text-royal-gold">
                Dine 24
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Experience the finest Indian cuisine with royal hospitality. 
              Flavors inspired by the seasons, traditions preserved through generations.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-semibold text-royal-gold">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-royal-gold" />
                <span>Dine 24, Kothapet, Hyderabad</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-royal-gold" />
                <span>+91 91333 35476</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-royal-gold" />
                <span>bhavyareddy.mamidala@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-semibold text-royal-gold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block hover:text-royal-gold transition-colors">
                About Restaurant
              </Link>
              <Link to="/menu" className="block hover:text-royal-gold transition-colors">
                Our Menu
              </Link>
              <Link to="/services" className="block hover:text-royal-gold transition-colors">
                Services
              </Link>
              <Link to="/reserve-table" className="block hover:text-royal-gold transition-colors">
                Reserve Table
              </Link>
              <Link to="/contact" className="block hover:text-royal-gold transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-semibold text-royal-gold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-royal-gold transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-royal-gold transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-royal-gold transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-royal-gold transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Stay connected for latest updates, special offers, and culinary delights.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-royal-gold/30 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Dine 24. All rights reserved. | Crafted with royal elegance and modern technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
