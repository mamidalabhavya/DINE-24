import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Flame, Leaf } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MenuSearch from "@/components/MenuSearch";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [vegFilter, setVegFilter] = useState<boolean | null>(null);

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setVegFilter(null);
  };

  // Check if any filters are applied
  const hasFilters = searchQuery !== "" || categoryFilter !== "" || vegFilter !== null;

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-royal-gold text-xl">Loading menu...</div>
      </div>
    );
  }

  // Filter menu items based on search and filters
  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesVeg = vegFilter === null || item.is_veg === vegFilter;
    
    return matchesSearch && matchesCategory && matchesVeg;
  }) || [];

  // Group filtered items by category
  const categorizedMenu = filteredItems.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Get unique categories for filter
  const categories = [...new Set(menuItems?.map(item => item.category) || [])];

  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="px-4 mb-16">
        <div className="container mx-auto text-center">
          <h1 className="font-playfair text-6xl font-bold text-royal-gold mb-6">
            Our Menu
          </h1>
          <p className="font-playfair text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated selection of authentic Indian dishes, 
            each prepared with traditional recipes and the finest ingredients.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 mb-8">
        <div className="container mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <MenuSearch
            onSearch={setSearchQuery}
            onCategoryFilter={setCategoryFilter}
            onVegFilter={setVegFilter}
            categories={categories}
          />
          <button
            onClick={clearFilters}
            disabled={!hasFilters}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
              hasFilters
                ? 'bg-royal-gold text-black hover:bg-royal-gold/80'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* Menu Categories */}
      {Object.entries(categorizedMenu).map(([category, items]: [string, any]) => (
        <section key={category} className="px-4 mb-16">
          <div className="container mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-royal-gold text-center mb-12">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item: any) => (
                <Card key={item.id} className="card-royal hover:scale-105 transition-transform">
                  <div className="relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400`}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-royal-gold text-black px-2 py-1 rounded text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {item.rating}
                    </div>
                    {/* Offer Badge */}
                    {item.offer_price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {Math.round(((item.price - item.offer_price) / item.price) * 100)}% OFF
                      </div>
                    )}
                    {/* Diet Indicators */}
                    <div className="absolute bottom-2 left-2 flex space-x-1">
                      {item.is_veg && (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          <Leaf className="h-3 w-3 mr-1" />
                          Veg
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="font-playfair text-xl font-semibold text-royal-gold">{item.name}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.quantity}</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        15-30 mins
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Delicious {item.name.toLowerCase()} prepared with authentic spices and fresh ingredients.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-royal-gold">
                          ₹{item.offer_price || item.price}
                        </span>
                        {item.offer_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.orders_placed} orders
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* No Results */}
      {Object.keys(categorizedMenu).length === 0 && (
        <section className="px-4 py-16">
          <div className="container mx-auto text-center">
            <h3 className="font-playfair text-2xl font-semibold text-royal-gold mb-4">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </section>
      )}

      {/* Menu Note */}
      <section className="px-4 bg-muted/50 py-16">
        <div className="container mx-auto text-center">
          <h3 className="font-playfair text-2xl font-semibold text-royal-gold mb-4">Note for Guests</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All our dishes are prepared fresh to order using traditional recipes and premium ingredients. 
            Cooking times may vary during peak hours. Please inform us about any allergies or dietary 
            restrictions, and we'll be happy to customize your meal accordingly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-500">
              <Leaf className="h-4 w-4 mr-1" />
              Vegetarian Options Available
            </Badge>
            <Badge variant="outline" className="border-red-500 text-red-500">
              <Flame className="h-4 w-4 mr-1" />
              Spice Level Customizable
            </Badge>
            <Badge variant="outline" className="border-royal-gold text-royal-gold">
              <Star className="h-4 w-4 mr-1" />
              Chef's Recommendations
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;