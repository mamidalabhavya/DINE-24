
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Minus, ShoppingCart, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BillPreview from "./BillPreview";
import CheckoutPanel from "./CheckoutPanel";

interface OrderSelectionProps {
  reservationData: any;
  selectedTable: any;
  onOrderComplete: (items: any[], total: number) => void;
}

const OrderSelection = ({ reservationData, selectedTable, onOrderComplete }: OrderSelectionProps) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [dietaryPreference, setDietaryPreference] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category, name');
      
      if (error) throw error;
      return data;
    }
  });

  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(menuItems?.map(item => item.category) || [])];

  const addToCart = (item: any) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(items =>
        items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      );
    } else {
      setSelectedItems(items => [...items, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setSelectedItems(items =>
        items.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i)
      );
    }
  };

  const removeFromCart = (itemId: number) => {
    setSelectedItems(items => items.filter(i => i.id !== itemId));
  };

  const totalAmount = selectedItems.reduce((sum, item) => {
    const price = item.offer_price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const itemsWithSelectedQuantity = selectedItems.map(item => ({
      ...item,
      selectedQuantity: item.quantity
    }));
    onOrderComplete(itemsWithSelectedQuantity, totalAmount);
  };

  const handleAIFoodRecommendation = async () => {
    if (!dietaryPreference || !cuisine) {
      setAiSuggestion("Please select your dietary preference and cuisine type first.");
      setShowAIRecommendations(true);
      return;
    }

    setLoadingAI(true);
    setShowAIRecommendations(true);
    
    try {
      const context = `Customer preferences: ${dietaryPreference} food, ${cuisine} cuisine. Available menu items: ${menuItems?.map(item => `${item.name} (${item.category}, ${item.is_veg ? 'Veg' : 'Non-Veg'}, ₹${item.price})`).join(', ')}. Recommend 3-5 items that match their preferences.`;
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `Recommend food items based on my preferences: ${dietaryPreference} and ${cuisine} cuisine`,
          context
        }
      });

      if (error) throw error;
      
      let cleanResponse = data.response.replace(/\*\*/g, '').replace(/\*/g, '');
      setAiSuggestion(cleanResponse);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      setAiSuggestion('Unable to get AI recommendation at the moment. Please browse our menu manually.');
    } finally {
      setLoadingAI(false);
    }
  };

  const applyAIFoodSuggestion = () => {
    const itemNames = aiSuggestion.toLowerCase().match(/(?:^|\n)\d+\.\s*([^(]+)/g);
    
    if (itemNames) {
      itemNames.forEach(match => {
        const itemName = match.replace(/^\d+\.\s*/, '').trim();
        const foundItem = menuItems?.find(item => 
          item.name.toLowerCase().includes(itemName) || 
          itemName.includes(item.name.toLowerCase())
        );
        
        if (foundItem) {
          addToCart(foundItem);
        }
      });
    }
    
    setShowAIRecommendations(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      {/* AI Food Recommendations */}
      <Card className="card-royal border-royal-gold">
        <CardHeader>
          <CardTitle className="text-royal-gold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Food Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Dietary Preference</label>
              <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                <SelectTrigger className="border-royal-gold">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Cuisine Type</label>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger className="border-royal-gold">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="continental">Continental</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={handleAIFoodRecommendation}
            className="btn-royal"
            disabled={loadingAI || !dietaryPreference || !cuisine}
          >
            {loadingAI ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Get AI Food Recommendations
          </Button>

          {showAIRecommendations && (
            <div className="mt-4 p-4 bg-royal-gold/10 border border-royal-gold rounded-lg">
              <h4 className="font-semibold text-royal-gold mb-2">AI Food Recommendations:</h4>
              {loadingAI ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting personalized food recommendations...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm whitespace-pre-line">{aiSuggestion}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyAIFoodSuggestion}
                      size="sm"
                      className="btn-royal"
                    >
                      Add Recommended Items to Cart
                    </Button>
                    <Button
                      onClick={() => setShowAIRecommendations(false)}
                      size="sm"
                      variant="outline"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="card-royal">
        <CardHeader>
          <CardTitle className="text-royal-subtitle">Select Your Dishes</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <Badge variant={item.is_veg ? "secondary" : "destructive"} className="text-xs">
                      {item.is_veg ? "Veg" : "Non-Veg"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.quantity}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.offer_price ? (
                        <>
                          <span className="font-bold text-royal-gold">₹{item.offer_price}</span>
                          <span className="text-xs line-through text-muted-foreground">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="font-bold text-royal-gold">₹{item.price}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="btn-royal h-8 px-3"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Floating Cart Button - positioned above AI chat */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-24 right-6 z-50">
          <Button
            onClick={() => setShowCheckout(true)}
            className="btn-royal rounded-full w-16 h-16 shadow-2xl hover:scale-110 transition-transform"
          >
            <div className="flex flex-col items-center">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs">{totalQuantity}</span>
            </div>
          </Button>
        </div>
      )}

      {/* Checkout Panel */}
      <CheckoutPanel
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        selectedItems={selectedItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        totalAmount={totalAmount}
        onCheckout={handleCheckout}
      />

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <BillPreview
          reservationData={reservationData}
          selectedItems={selectedItems}
          selectedTable={selectedTable}
          totalAmount={totalAmount}
          onClose={() => setShowBillPreview(false)}
        />
      )}
    </div>
  );
};

export default OrderSelection;
