
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Flame, Gift, Timer } from "lucide-react";

const TodaysSpecial = () => {
  const todaysSpecials = [
    {
      id: 1,
      name: "Royal Thali Supreme",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
      originalPrice: 450,
      specialPrice: 350,
      badge: "Chef's Choice",
      whySpecial: "A curated selection of our finest dishes, perfectly balanced for a complete royal dining experience. Features seasonal vegetables and premium spices.",
      timeRelevance: "Perfect for lunch or dinner",
      limitedInfo: "Only 50 servings available today",
      ingredients: ["Basmati Rice", "Dal Makhani", "Paneer Curry", "Mixed Vegetables", "Raita", "Pickle", "Dessert"],
      cookTime: "35 mins",
      rating: 4.9,
      discount: 22
    },
    {
      id: 2,
      name: "Monsoon Special Biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03246962d735?w=600",
      originalPrice: 320,
      specialPrice: 280,
      badge: "Limited Edition",
      whySpecial: "Inspired by the fresh monsoon flavors, this biryani features aromatic spices and tender meat slow-cooked to perfection.",
      timeRelevance: "Ideal for the rainy season",
      limitedInfo: "Available only during monsoon months",
      ingredients: ["Premium Basmati", "Mutton/Chicken", "Special Monsoon Spices", "Mint", "Fried Onions"],
      cookTime: "45 mins",
      rating: 4.8,
      discount: 12
    },
    {
      id: 3,
      name: "Midnight Dessert Platter",
      image: "https://images.unsplash.com/photo-1571197119282-7c4d555d5d8c?w=600",
      originalPrice: 200,
      specialPrice: 150,
      badge: "Hot Item",
      whySpecial: "A delightful assortment of traditional Indian sweets, perfect for ending your royal meal on a sweet note.",
      timeRelevance: "Perfect after-dinner treat",
      limitedInfo: "Fresh batches made every 2 hours",
      ingredients: ["Gulab Jamun", "Ras Malai", "Kheer", "Laddu", "Jalebi"],
      cookTime: "15 mins",
      rating: 4.7,
      discount: 25
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Chef's Choice": return "bg-royal-gold text-black";
      case "Limited Edition": return "bg-purple-500 text-white";
      case "Hot Item": return "bg-red-500 text-white";
      default: return "bg-royal-gold text-black";
    }
  };

  return (
    <div className="min-h-screen py-16">
      {/* Hero Section - Updated without crown icon */}
      <section className="px-4 mb-16">
        <div className="container mx-auto text-center">
          <Flame className="h-16 w-16 text-royal-gold mx-auto mb-4 animate-pulse" />
          <h1 className="font-playfair text-6xl font-bold text-royal-gold mb-6 tracking-wider">
            Today's Special
          </h1>
          <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Handcrafted culinary masterpieces, specially curated by our royal chefs for today's discerning guests
          </p>
        </div>
      </section>

      {/* Special Dishes */}
      <section className="px-4">
        <div className="container mx-auto">
          <div className="space-y-12">
            {todaysSpecials.map((special, index) => (
              <Card key={special.id} className="card-royal overflow-hidden">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Image Section */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img 
                      src={special.image} 
                      alt={special.name}
                      className="w-full h-80 lg:h-full object-cover rounded-lg"
                    />
                    {/* Overlays */}
                    <Badge className={`absolute top-4 left-4 ${getBadgeColor(special.badge)} text-lg px-3 py-1`}>
                      {special.badge}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-royal-gold text-royal-gold" />
                        <span className="font-semibold">{special.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                      {special.discount}% OFF
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`flex flex-col justify-center space-y-6 p-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div>
                      <h2 className="font-playfair text-3xl font-bold text-royal-gold mb-4">
                        {special.name}
                      </h2>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-3xl">
                          <span className="font-bold text-royal-gold">₹{special.specialPrice}</span>
                          <span className="text-lg text-muted-foreground line-through">₹{special.originalPrice}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{special.cookTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-royal-gold mb-2 flex items-center">
                          <Flame className="h-5 w-5 mr-2" />
                          Why It's Special
                        </h3>
                        <p className="text-muted-foreground">{special.whySpecial}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-royal-gold mb-2 flex items-center">
                            <Timer className="h-4 w-4 mr-2" />
                            Perfect Time
                          </h4>
                          <p className="text-sm text-muted-foreground">{special.timeRelevance}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-royal-gold mb-2 flex items-center">
                            <Gift className="h-4 w-4 mr-2" />
                            Limited Availability
                          </h4>
                          <p className="text-sm text-muted-foreground">{special.limitedInfo}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-royal-gold mb-2">Key Ingredients</h4>
                        <div className="flex flex-wrap gap-2">
                          {special.ingredients.map((ingredient, idx) => (
                            <Badge key={idx} variant="outline" className="border-royal-gold text-royal-gold">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-royal flex-1">
                        Order Now
                      </Button>
                      <Button variant="outline" className="royal-border flex-1">
                        Add to Favorites
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Note */}
      <section className="px-4 mt-16 bg-royal-gradient py-16">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-4xl font-bold text-black mb-6">
            Today's Specials - Limited Time Only!
          </h2>
          <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            Our chefs craft these special dishes daily using the freshest ingredients and seasonal inspirations. 
            Each special is available only while supplies last, making every visit a unique culinary adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-royal-gold text-lg px-8 py-3">
              View Full Menu
            </Button>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-royal-gold text-lg px-8 py-3">
              Reserve Table
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TodaysSpecial;
