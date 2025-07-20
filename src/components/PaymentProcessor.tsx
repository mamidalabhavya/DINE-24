
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentProcessorProps {
  amount: number;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

const PaymentProcessor = ({ amount, onPaymentSuccess, onCancel }: PaymentProcessorProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      // Basic validation
      if (paymentMethod === 'upi' && !paymentDetails.upiId) {
        throw new Error('Please enter UPI ID');
      }
      if (paymentMethod === 'card' && (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv)) {
        throw new Error('Please fill all card details');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentComplete(true);
      
      setTimeout(() => {
        onPaymentSuccess();
        toast({
          title: "Payment Successful!",
          description: `₹${amount} has been paid successfully.`,
        });
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <Card className="card-royal max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-royal-gold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-4">
            ₹{amount} has been processed successfully
          </p>
          <div className="animate-pulse text-sm text-muted-foreground">
            Redirecting to confirmation...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-royal max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-royal-gold text-center">
          Complete Payment
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Amount to pay: <span className="font-bold text-royal-gold">₹{amount}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              UPI Payment
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Debit/Credit Card
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === 'upi' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="Enter your UPI ID (e.g., user@paytm)"
                value={paymentDetails.upiId}
                onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
              />
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="Enter name as on card"
                value={paymentDetails.cardholderName}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardholderName: e.target.value})}
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={handlePayment} 
            className="btn-royal flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay ₹${amount}`}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
