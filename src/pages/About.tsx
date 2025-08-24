
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Award, Clock, Heart, Star } from "lucide-react";

const About = () => {
  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description: "Dine 24 was established with a vision to serve authentic Indian cuisine"
    },
    {
      year: "2021",
      title: "Award Recognition",
      description: "Received 'Best Traditional Restaurant' award from Hyderabad Food Council"
    },
    {
      year: "2022",
      title: "Expansion",
      description: "Extended dining space to accommodate 200+ guests with private cabins"
    },
    {
      year: "2023",
      title: "Digital Innovation",
      description: "Launched online reservation system and food delivery services"
    },
    {
      year: "2024",
      title: "Royal Experience",
      description: "Redesigned interiors with royal theme and introduced seasonal menus"
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-royal-gold" />,
      title: "Authenticity",
      description: "Every recipe is crafted using traditional methods passed down through generations"
    },
    {
      icon: <Crown className="h-8 w-8 text-royal-gold" />,
      title: "Royal Hospitality",
      description: "We treat every guest as royalty, ensuring exceptional service and comfort"
    },
    {
      icon: <Star className="h-8 w-8 text-royal-gold" />,
      title: "Quality Excellence",
      description: "Premium ingredients sourced directly from farms for the finest taste experience"
    },
    {
      icon: <Users className="h-8 w-8 text-royal-gold" />,
      title: "Community Focus",
      description: "Building lasting relationships with our guests and local community"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="px-4 mb-16">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-16 w-16 text-royal-gold animate-glow" />
          </div>
          <h1 className="font-great-vibes text-6xl font-bold text-royal-gold mb-6">
            About Dine 24
          </h1>
          <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A culinary journey that began with a simple dream - to bring the authentic 
            flavors of India to every table, served with royal elegance and warm hospitality.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 mb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-royal-title mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Founded in the heart of Hyderabad's Kothapet, Dine 24 emerged from a 
                  passionate desire to celebrate India's rich culinary heritage. Our founders, 
                  inspired by their grandmother's traditional recipes, envisioned a place where 
                  every meal would be a royal feast.
                </p>
                <p>
                  What started as a small family restaurant has grown into a beloved dining 
                  destination, known for its authentic flavors, elegant ambiance, and 
                  unwavering commitment to excellence. We believe that food is not just 
                  sustenance—it's emotion, memory, and tradition served on a plate.
                </p>
                <p>
                  Today, Dine 24 stands as a testament to the power of passion, quality, 
                  and genuine hospitality. Every dish we serve carries forward the legacy 
                  of Indian culinary artistry, adapted for the modern palate while 
                  preserving its authentic soul.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600" 
                alt="Restaurant Interior"
                className="w-full h-96 object-cover rounded-lg royal-shadow"
              />
              <div className="absolute inset-0 bg-royal-gold/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 mb-16 bg-muted/50 py-16">
        <div className="container mx-auto">
          <h2 className="text-royal-title text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-royal text-center hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-royal-subtitle">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

{/* Our Journey */}
<section className="px-4 mb-16">
  <div className="container mx-auto">
    <h2 className="text-royal-title text-center mb-12">Our Journey</h2>
    <div className="relative">
      {/* Timeline line */}
      <div
        className="
          absolute 
          left-[100%] translate-x-0    /* Mobile: right side, away from box */
          md:left-1/2 md:-translate-x-1/2 /* Desktop: center */
          h-full w-1 bg-royal-gold
        "
      ></div>

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="
              flex items-center
              justify-start           /* Mobile: always left */
              md:justify-start md:even:justify-end
              relative
            "
          >
            {/* Card */}
            <Card
              className="
                card-royal w-full max-w-lg
                mr-6                   /* Space on mobile to avoid overlap */
                md:mr-8 md:ml-0
                md:even:ml-8 md:even:mr-0
              "
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-royal-gold text-black text-lg px-3 py-1">
                    {milestone.year}
                  </Badge>
                  <CardTitle className="text-royal-subtitle">
                    {milestone.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {milestone.description}
                </p>
              </CardContent>
            </Card>

            {/* Dot */}
            <div
              className="
                w-4 h-4 bg-royal-gold rounded-full border-4 border-background
                absolute 
                left-[100%] translate-x-0   /* Mobile: right */
                md:left-1/2 md:-translate-x-1/2 /* Desktop: center */
              "
            ></div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>




      {/* Mission & Vision */}
      <section className="px-4 mb-16 bg-royal-gradient py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-black/80 border-royal-gold text-white">
              <CardHeader>
                <CardTitle className="text-3xl font-playfair text-royal-gold mb-4">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  To preserve and celebrate India's culinary heritage by serving authentic, 
                  high-quality dishes in an atmosphere of royal hospitality, creating 
                  memorable dining experiences that connect people with their cultural roots.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border-royal-gold text-white">
              <CardHeader>
                <CardTitle className="text-3xl font-playfair text-royal-gold mb-4">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  To become the most beloved destination for authentic Indian cuisine, 
                  where every meal is a celebration, every guest feels like royalty, 
                  and every visit creates lasting memories of exceptional food and service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chef's Message */}
      <section className="px-4">
        <div className="container mx-auto">
          <Card className="card-royal max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <img 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400" 
                  alt="Head Chef"
                  className="w-full h-64 lg:h-full object-cover rounded-lg"
                />
              </div>
              <div className="lg:col-span-2 flex flex-col justify-center">
                <h3 className="text-royal-title text-left mb-4">Chef's Message</h3>
                <blockquote className="text-lg text-muted-foreground italic mb-4">
                  "Cooking is not just about preparing food; it's about creating emotions, 
                  preserving traditions, and bringing people together. At Dine 24, every dish 
                  is crafted with love, respect for tradition, and a commitment to excellence. 
                  We don't just serve food—we serve memories."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <Award className="h-6 w-6 text-royal-gold" />
                  <div>
                    <p className="font-semibold text-royal-gold">Chef Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Head Chef & Culinary Director</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
