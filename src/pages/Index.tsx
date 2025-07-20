
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Utensils, Users, Award, ChefHat, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  // Fetch top-rated menu items for "Top Notch Dishes"
  const { data: topDishes } = useQuery({
    queryKey: ['top-dishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch today's specials
  const { data: todaysSpecials } = useQuery({
    queryKey: ['todays-specials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todays_specials')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('is_active', true)
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Golden Designs */}
      <section className="relative bg-gradient-to-b from-background via-royal-gold/5 to-muted py-20 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-royal-gold/20 animate-pulse">
          <Crown className="h-16 w-16" />
        </div>
        <div className="absolute top-20 right-16 text-royal-gold/20 animate-pulse">
          <Sparkles className="h-12 w-12" />
        </div>
        <div className="absolute bottom-20 left-20 text-royal-gold/20 animate-pulse">
          <ChefHat className="h-14 w-14" />
        </div>
        <div className="absolute bottom-16 right-12 text-royal-gold/20 animate-pulse">
          <Utensils className="h-10 w-10" />
        </div>
        
        {/* Golden Border Design */}
        <div className="absolute inset-0 border-4 border-royal-gold/10 m-8 rounded-xl"></div>
        <div className="absolute inset-0 border-2 border-royal-gold/20 m-12 rounded-lg"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="bg-gradient-to-r from-transparent via-royal-gold/10 to-transparent p-1 rounded-2xl mb-8">
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-8 border border-royal-gold/30">
              <h1 className="font-playfair text-6xl md:text-7xl font-bold bg-gradient-to-r from-royal-gold via-yellow-500 to-royal-gold bg-clip-text text-transparent mb-6 drop-shadow-2xl">
                DINE24
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent mx-auto mb-6"></div>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
                Experience Royal Dining Excellence Around the Clock
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/reserve-table">
                  <Button size="lg" className="btn-royal shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                    Reserve Your Table
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button size="lg" variant="outline" className="border-royal-gold/50 text-royal-gold hover:bg-royal-gold/10 shadow-lg">
                    Explore Menu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Notch Dishes Section - Using Database Data */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-royal-gold mb-6">
              Top Notch Dishes
            </h2>
            <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our most beloved creations, crafted with passion and served with pride
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topDishes?.map((dish) => (
              <Card key={dish.id} className="card-royal group hover:scale-105 transition-transform">
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <Badge variant={dish.is_veg ? "secondary" : "destructive"} className="mb-2">
                      {dish.is_veg ? "Veg" : "Non-Veg"}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-royal-gold text-royal-gold" />
                      <span className="font-semibold">{dish.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-royal-subtitle group-hover:text-royal-gold transition-colors">
                    {dish.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{dish.quantity}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {dish.offer_price ? (
                        <>
                          <span className="font-bold text-royal-gold text-xl">₹{dish.offer_price}</span>
                          <span className="line-through text-muted-foreground">₹{dish.price}</span>
                        </>
                      ) : (
                        <span className="font-bold text-royal-gold text-xl">₹{dish.price}</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dish.orders_placed} orders
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Special Section - Using Database Data */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-royal-gold mb-6">
              Today's Special
            </h2>
            <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Handpicked delicacies prepared with today's freshest ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todaysSpecials?.map((special) => (
              <Card key={special.id} className="card-royal group hover:scale-105 transition-transform">
                <CardHeader className="relative">
                  <Badge className="bg-royal-gold text-black mb-2 w-fit">
                    Today's Special
                  </Badge>
                  <CardTitle className="text-royal-subtitle group-hover:text-royal-gold transition-colors">
                    {special.menu_items?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{special.special_description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-royal-gold text-xl">
                        ₹{special.special_price || special.menu_items?.price}
                      </span>
                      {special.special_price && special.menu_items?.price && (
                        <span className="line-through text-muted-foreground">
                          ₹{special.menu_items.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-royal-gold text-royal-gold" />
                      <span className="font-semibold">{special.menu_items?.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/todays-special">
              <Button className="btn-royal text-lg px-8 py-3">
                View All Specials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-royal-gold mb-6">
              Why Choose DINE24?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-royal-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-royal-gold" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-royal-subtitle mb-4">
                24/7 Service
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Round-the-clock dining experience with the same royal treatment at any hour
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-royal-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-royal-gold" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-royal-subtitle mb-4">
                Award Winning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Recognized for excellence in culinary arts and exceptional hospitality
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-royal-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-royal-gold" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-royal-subtitle mb-4">
                Expert Chefs
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Master chefs with decades of experience in royal cuisine traditions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-royal-gradient">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-5xl font-bold text-black mb-6">
            Ready for a Royal Experience?
          </h2>
          <p className="font-playfair text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Book your table now and embark on a culinary journey fit for royalty
          </p>
          <Link to="/reserve-table">
            <Button size="lg" className="bg-black text-royal-gold hover:bg-black/90 text-xl px-12 py-4">
              Make Reservation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
