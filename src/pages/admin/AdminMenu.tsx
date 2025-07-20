
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  offer_price?: number;
  quantity: string;
  rating: number;
  is_veg: boolean;
  orders_placed: number;
  created_at: string;
  updated_at: string;
}

const AdminMenu = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    offer_price: 0,
    quantity: '',
    rating: 0,
    is_veg: true
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
      return data as MenuItem[];
    }
  });

  const addMenuItemMutation = useMutation({
    mutationFn: async (newItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'orders_placed'>) => {
      console.log('Adding menu item:', newItem);
      
      // Check if item with same name already exists
      const { data: existingItems } = await supabase
        .from('menu_items')
        .select('name')
        .eq('name', newItem.name.trim());

      if (existingItems && existingItems.length > 0) {
        throw new Error('A menu item with this name already exists');
      }
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          name: newItem.name.trim(),
          category: newItem.category,
          price: newItem.price,
          offer_price: newItem.offer_price || null,
          quantity: newItem.quantity.trim(),
          rating: newItem.rating || 0,
          is_veg: newItem.is_veg,
          orders_placed: 0
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding menu item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success",
        description: "Menu item added successfully!",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error adding menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add menu item",
        variant: "destructive",
      });
    }
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<MenuItem> }) => {
      console.log('Updating menu item:', id, updates);
      
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          ...updates,
          offer_price: updates.offer_price || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating menu item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success",
        description: "Menu item updated successfully!",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating menu item:', error);
      toast({
        title: "Error",
        description: `Failed to update menu item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting menu item:', id);
      
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting menu item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success",
        description: "Menu item deleted successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",  
        description: `Failed to delete menu item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: 0,
      offer_price: 0,
      quantity: '',
      rating: 0,
      is_veg: true
    });
    setSelectedItem(null);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      offer_price: item.offer_price || 0,
      quantity: item.quantity,
      rating: item.rating,
      is_veg: item.is_veg
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter item name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category.trim()) {
      toast({
        title: "Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.quantity.trim()) {
      toast({
        title: "Error",
        description: "Please enter quantity/serving info.",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting form data:', formData);

    if (isEditing && selectedItem) {
      updateMenuItemMutation.mutate({
        id: selectedItem.id,
        updates: {
          name: formData.name.trim(),
          category: formData.category,
          price: formData.price,
          offer_price: formData.offer_price > 0 ? formData.offer_price : null,
          quantity: formData.quantity.trim(),
          rating: formData.rating,
          is_veg: formData.is_veg
        }
      });
    } else {
      addMenuItemMutation.mutate({
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price,
        offer_price: formData.offer_price > 0 ? formData.offer_price : null,
        quantity: formData.quantity.trim(),
        rating: formData.rating,
        is_veg: formData.is_veg
      });
    }
  };

  // Unique categories from existing items
  const existingCategories = [...new Set(menuItems?.map(item => item.category) || [])];
  const allCategories = [...new Set([...existingCategories, 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Snacks', 'Pizza', 'Specials', 'Drinks'])];

  if (isLoading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-royal-gold">Menu Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-royal"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter dish name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(cat => (
                      <SelectItem key={`category-${cat}`} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="offer_price">Offer Price (₹)</Label>
                  <Input
                    id="offer_price"
                    type="number"
                    value={formData.offer_price || ''}
                    onChange={(e) => setFormData({...formData, offer_price: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity/Serving *</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g., 1 plate, 250ml"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  value={formData.rating || ''}
                  onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_veg"
                  checked={formData.is_veg}
                  onCheckedChange={(checked) => setFormData({...formData, is_veg: checked})}
                />
                <Label htmlFor="is_veg">Vegetarian</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="btn-royal flex-1"
                  disabled={addMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                >
                  {isEditing ? 'Update Item' : 'Add Item'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems?.map((item) => (
          <Card key={item.id} className="card-royal">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-royal-gold">{item.name}</h3>
                  <div className="flex gap-1">
                    {item.is_veg && (
                      <Badge className="bg-green-500 text-white text-xs">Veg</Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Category: {item.category}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <span className="font-bold text-royal-gold">₹{item.offer_price || item.price}</span>
                    {item.offer_price && (
                      <span className="text-sm text-muted-foreground line-through">₹{item.price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Orders: {item.orders_placed}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this item?')) {
                        deleteMenuItemMutation.mutate(item.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No menu items found.</p>
          <Button onClick={() => setIsDialogOpen(true)} className="btn-royal">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Menu Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
