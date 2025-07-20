
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Crown, Gift, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSpecial = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<any>(null);
  const [formData, setFormData] = useState({
    menu_item_id: '',
    special_price: '',
    special_description: ''
  });

  const queryClient = useQueryClient();

  // Fetch menu items
  const { data: menuItems } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch today's specials
  const { data: todaysSpecials, isLoading } = useQuery({
    queryKey: ['todays-specials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todays_specials')
        .select(`
          *,
          menu_items (
            id, name, price, category, is_veg, rating
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Add/Update special mutation
  const addSpecialMutation = useMutation({
    mutationFn: async (specialData: any) => {
      if (editingSpecial) {
        const { error } = await supabase
          .from('todays_specials')
          .update(specialData)
          .eq('id', editingSpecial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('todays_specials')
          .insert([specialData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todays-specials'] });
      toast.success(editingSpecial ? 'Special updated successfully!' : 'Special added successfully!');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error managing special:', error);
      toast.error('Failed to save special. Please try again.');
    }
  });

  // Delete special mutation
  const deleteSpecialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todays_specials')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todays-specials'] });
      toast.success('Special deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting special:', error);
      toast.error('Failed to delete special.');
    }
  });

  // Toggle special status mutation
  const toggleSpecialMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase
        .from('todays_specials')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todays-specials'] });
      toast.success('Special status updated!');
    },
    onError: (error) => {
      console.error('Error toggling special:', error);
      toast.error('Failed to update special status.');
    }
  });

  const resetForm = () => {
    setFormData({
      menu_item_id: '',
      special_price: '',
      special_description: ''
    });
    setEditingSpecial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.menu_item_id || !formData.special_price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const specialData = {
      menu_item_id: parseInt(formData.menu_item_id),
      special_price: parseFloat(formData.special_price),
      special_description: formData.special_description,
      is_active: true,
      updated_at: new Date().toISOString()
    };

    addSpecialMutation.mutate(specialData);
  };

  const handleEdit = (special: any) => {
    setEditingSpecial(special);
    setFormData({
      menu_item_id: special.menu_item_id.toString(),
      special_price: special.special_price.toString(),
      special_description: special.special_description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this special?')) {
      deleteSpecialMutation.mutate(id);
    }
  };

  const toggleSpecialStatus = (id: string, currentStatus: boolean) => {
    toggleSpecialMutation.mutate({ id, is_active: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-royal-gold text-xl">Loading specials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-royal-gold mb-2">
              Today's Special Management
            </h1>
            <p className="text-muted-foreground">
              Manage daily special dishes and promotions
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-royal" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Special
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSpecial ? 'Edit Special' : 'Add New Special'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Menu Item *</label>
                  <Select
                    value={formData.menu_item_id}
                    onValueChange={(value) => setFormData({ ...formData, menu_item_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select menu item" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name} - ₹{item.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Special Price *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.special_price}
                    onChange={(e) => setFormData({ ...formData, special_price: e.target.value })}
                    placeholder="Enter special price"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Special Description</label>
                  <Textarea
                    value={formData.special_description}
                    onChange={(e) => setFormData({ ...formData, special_description: e.target.value })}
                    placeholder="Describe what makes this special..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="btn-royal flex-1">
                    {editingSpecial ? 'Update' : 'Add'} Special
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Specials List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {todaysSpecials?.map((special) => {
            const menuItem = special.menu_items;
            const discount = menuItem ? Math.round(((menuItem.price - special.special_price) / menuItem.price) * 100) : 0;
            
            return (
              <Card key={special.id} className="card-royal">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-royal-gold text-lg">
                        {menuItem?.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={menuItem?.is_veg ? "secondary" : "destructive"}>
                          {menuItem?.is_veg ? "Veg" : "Non-Veg"}
                        </Badge>
                        <Badge className="bg-royal-gold text-black">
                          {discount}% OFF
                        </Badge>
                        <Badge variant={special.is_active ? "default" : "secondary"}>
                          {special.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSpecialStatus(special.id, special.is_active)}
                      >
                        {special.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(special)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(special.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Original Price:</span>
                      <span className="line-through text-muted-foreground">₹{menuItem?.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Special Price:</span>
                      <span className="text-xl font-bold text-royal-gold">₹{special.special_price}</span>
                    </div>
                    {special.special_description && (
                      <div>
                        <span className="text-sm font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {special.special_description}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{menuItem?.rating || 0}</span>
                      </div>
                      <span>Category: {menuItem?.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!todaysSpecials || todaysSpecials.length === 0) && (
          <Card className="card-royal">
            <CardContent className="text-center py-12">
              <Crown className="h-16 w-16 text-royal-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-royal-gold mb-2">
                No Specials Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first today's special to attract more customers!
              </p>
              <Button className="btn-royal" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Special
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSpecial;
