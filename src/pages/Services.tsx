
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Clock, 
  Shield, 
  Truck, 
  Users, 
  Calendar,
  Phone,
  Utensils,
  Gift,
  Star,
  MapPin,
  ArrowRight
} from "lucide-react";

const Services = () => {
  const mainServices = [
    {
      icon: <Clock className="h-12 w-12 text-royal-gold" />,
      title: "Online Table & Food Reservation",
      description: "Book your table and pre-order your favorite dishes online for a seamless dining experience.",
      features: [
        "Real-time table availability",
        "Pre-order food options",
        "Special occasion setup",
        "Group booking discounts"
      ],
      link: "/reserve-table"
    },
    {
      icon: <Shield className="h-12 w-12 text-royal-gold" />,
      title: "Hygienic Environment",
      description: "Maintaining highest standards of cleanliness and hygiene for your safety and comfort.",
      features: [
        "Regular sanitization",
        "Fresh ingredient sourcing",
        "Clean kitchen standards",
        "Staff health monitoring"
      ],
      link: "/about"
    },
    {
      icon: <Truck className="h-12 w-12 text-royal-gold" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service bringing restaurant-quality food to your doorstep.",
      features: [
        "30-minute delivery promise",
        "Hot food guarantee",
        "Contactless delivery",
        "Order tracking system"
      ],
      link: "/menu"
    }
  ];

  const additionalServices = [
    {
      icon: <Users className="h-8 w-8 text-royal-gold" />,
      title: "Private Events",
      description: "Host your special occasions in our elegant private dining areas"
    },
    {
      icon: <Calendar className="h-8 w-8 text-royal-gold" />,
      title: "Catering Services",
      description: "Bring Dine 24's royal flavors to your venue with our catering service"
    },
    {
      icon: <Phone className="h-8 w-8 text-royal-gold" />,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for all your dining and reservation needs"
    },
    {
      icon: <Utensils className="h-8 w-8 text-royal-gold" />,
      title: "Custom Menu Planning",
      description: "Personalized menu curation for special dietary requirements"
    },
    {
      icon: <Gift className="h-8 w-8 text-royal-gold" />,
      title: "Loyalty Rewards",
      description: "Earn points with every visit and unlock exclusive dining benefits"
    },
    {
      icon: <Star className="h-8 w-8 text-royal-gold" />,
      title: "Chef's Table Experience",
      description: "Exclusive dining experience with our head chef's personalized service"
    }
  ];

  const servicePackages = [
    {
      title: "Royal Family Package",
      price: "₹2,999",
      description: "Perfect for family celebrations and gatherings",
      features: [
        "Table for 6-8 people",
        "Complimentary appetizers",
        "Special occasion decoration",
        "Dedicated server",
        "20% discount on food bill"
      ],
      popular: false
    },
    {
      title: "Corporate Executive Package",
      price: "₹5,999",
      description: "Ideal for business meetings and corporate events",
      features: [
        "Private cabin booking",
        "Business lunch menu",
        "AV equipment support",
        "Complimentary tea/coffee",
        "Flexible timing options"
      ],
      popular: true
    },
    {
      title: "Wedding Celebration Package",
      price: "₹15,999",
      description: "Make your special day even more memorable",
      features: [
        "Hall booking for 50+ guests",
        "Customized wedding menu",
        "Decoration arrangements",
        "Photography assistance",
        "Complimentary wedding cake"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="px-4 mb-16">
        <div className="container mx-auto text-center">
          <h1 className="font-great-vibes text-6xl font-bold text-royal-gold mb-6">
            Our Services
          </h1>
          <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience royal dining with our comprehensive range of services designed 
            to make every meal memorable and every occasion special.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="px-4 mb-16">
        <div className="container mx-auto">
          <h2 className="text-royal-title text-center mb-12">Core Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="card-royal hover:scale-105 transition-transform">
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-royal-subtitle whitespace-nowrap text-center">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center text-[15px] max-w-[400px] mx-auto">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-royal-gold mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={service.link}>
                    <Button className="btn-royal w-full mt-4 ">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="px-4 mb-16 bg-muted/50 py-16">
        <div className="container mx-auto">
          <h2 className="text-royal-title text-center mb-12">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="card-royal text-center hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg font-cinzel text-royal-gold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="px-4 mb-16">
        <div className="container mx-auto">
          <h2 className="text-royal-title text-center mb-12">Service Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicePackages.map((pkg, index) => (
              <Card key={index} className={`card-royal relative ${pkg.popular ? 'ring-2 ring-royal-gold' : ''}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-royal-gold text-black">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-royal-subtitle">{pkg.title}</CardTitle>
                  <div className="text-3xl font-bold text-royal-gold">{pkg.price}</div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-royal-gold mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="btn-royal w-full">
                    Book Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Services */}
      <section className="px-4 bg-royal-gradient py-16">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-4xl font-bold text-black mb-6">
            Need Custom Service?
          </h2>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            Have a special requirement or need a customized service package? 
            Our team is here to create the perfect dining experience for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-black">
              <Phone className="h-5 w-5" />
              <span className="font-semibold">+91 91333 35476</span>
            </div>
            <div className="flex items-center space-x-2 text-black">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Kothapet, Hyderabad</span>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-royal-gold text-lg px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
