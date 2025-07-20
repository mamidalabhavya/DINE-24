
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus, ShoppingCart, Receipt, CreditCard } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import PaymentProcessor from "./PaymentProcessor";

interface CheckoutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: any[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  totalAmount: number;
  onCheckout: () => void;
}

const CheckoutPanel = ({ 
  isOpen, 
  onClose, 
  selectedItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  totalAmount, 
  onCheckout 
}: CheckoutPanelProps) => {
  const { theme } = useTheme();
  const [showBilling, setShowBilling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const subtotal = selectedItems.reduce((sum, item) => 
    sum + (item.offer_price || item.price) * item.quantity, 0
  );
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onCheckout();
  };

  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <PaymentProcessor
          amount={total}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    );
  }

  return (
    <div className={`fixed right-0 top-[25%] h-[75%] w-1/4 min-w-80 z-40 transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } ${theme === 'dark' ? 'bg-gray-900 border-l border-gray-700' : 'bg-white border-l border-gray-200'} shadow-2xl rounded-tl-lg`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between bg-royal-gold/10 rounded-tl-lg`}>
          <div className="flex items-center gap-3">
            <div className="bg-royal-gold/20 p-2 rounded-full">
              <ShoppingCart className="h-5 w-5 text-royal-gold" />
            </div>
            <h2 className="font-semibold text-lg text-royal-gold">Your Order</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-royal-gold/10 text-royal-gold"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <Card key={item.id} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'} border-royal-gold/20`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-sm flex-1 pr-2">{item.name}</h3>
                      <Badge variant={item.is_veg ? "secondary" : "destructive"} className="text-xs shrink-0">
                        {item.is_veg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-royal-gold">
                          ₹{(item.offer_price || item.price) * item.quantity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ₹{item.offer_price || item.price} each
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="h-7 w-7 p-0 border-royal-gold/30"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center bg-royal-gold/10 py-1 rounded">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 p-0 border-royal-gold/30"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals and checkout */}
        {selectedItems.length > 0 && (
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} space-y-4 bg-royal-gold/5`}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-royal-gold">₹{total}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => setShowBilling(true)}
                className="w-full btn-royal flex items-center justify-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Preview Bill
              </Button>
              <Button
                onClick={() => setShowPayment(true)}
                className="w-full border-royal-gold/50 text-royal-gold hover:bg-royal-gold/10 flex items-center justify-center gap-2"
                variant="outline"
              >
                <CreditCard className="h-4 w-4" />
                Proceed to Payment
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-2 rounded">
              💡 <strong>Dining Time Limit:</strong> 1 hour from service start. 
              Extended dining incurs 15% additional charge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPanel;
