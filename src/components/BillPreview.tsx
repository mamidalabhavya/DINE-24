
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { generateReservationPDF } from "@/utils/pdfGenerator";

interface BillPreviewProps {
  reservationData: any;
  selectedItems: any[];
  selectedTable: any;
  totalAmount: number;
  onClose: () => void;
}

const BillPreview = ({ 
  reservationData, 
  selectedItems, 
  selectedTable, 
  totalAmount, 
  onClose 
}: BillPreviewProps) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const generatePDF = async () => {
    try {
      const reservationDetails = {
        ...reservationData,
        full_name: reservationData.fullName,
        arrival_date: reservationData.arrivalDate,
        arrival_time: reservationData.arrivalTime,
        num_people: reservationData.numPeople,
        table_number: selectedTable?.table_number,
        table_capacity: selectedTable?.seating_capacity,
        total_amount: totalAmount,
        id: `RES${Date.now().toString().slice(-8)}`
      };

      const orderItems = selectedItems.map(item => ({
        ...item,
        selectedQuantity: item.quantity
      }));

      const pdfContent = await generateReservationPDF(reservationDetails, orderItems);
      
      const link = document.createElement('a');
      link.href = pdfContent;
      link.download = `DINE24_Bill_${reservationData.fullName.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      toast({
        title: "Success",
        description: "Bill downloaded successfully!",
      });
      
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendEmail = async () => {
    try {
      toast({
        title: "Sending email...",
        description: "Please wait while we send your bill.",
      });

      const reservationDetails = {
        ...reservationData,
        full_name: reservationData.fullName,
        arrival_date: reservationData.arrivalDate,
        arrival_time: reservationData.arrivalTime,
        num_people: reservationData.numPeople,
        table_number: selectedTable?.table_number,
        table_capacity: selectedTable?.seating_capacity,
        total_amount: totalAmount,
        id: `RES${Date.now().toString().slice(-8)}`
      };

      const orderItems = selectedItems.map(item => ({
        ...item,
        selectedQuantity: item.quantity
      }));

      const pdfContent = await generateReservationPDF(reservationDetails, orderItems);
      
      const subtotal = selectedItems.reduce((sum, item) => 
        sum + (item.offer_price || item.price) * item.quantity, 0);
      const gst = Math.round(subtotal * 0.18);
      const total = subtotal + gst;

      const orderItemsHtml = selectedItems.length > 0 ? `
        <h3 style="color: #d4af37; margin-top: 20px;">Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${selectedItems.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.offer_price || item.price}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(item.offer_price || item.price) * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal:</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${subtotal}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">GST (18%):</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${gst}</td>
            </tr>
            <tr style="font-weight: bold; color: #d4af37;">
              <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Amount:</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${total}</td>
            </tr>
          </tfoot>
        </table>
        <p style="color: #666; margin-top: 10px;"><strong>Payment:</strong> Pay on Arrival</p>
      ` : '';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%); padding: 30px; text-align: center;">
            <h1 style="color: #000; margin: 0; font-size: 28px;">🍽️ DINE 24</h1>
            <p style="color: #333; margin: 10px 0 0 0; font-size: 16px;">Premium Dining Experience</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #d4af37; margin-bottom: 20px;">Your Bill Preview</h2>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Dear <strong>${reservationData.fullName}</strong>,
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d4af37; margin-top: 0;">Reservation Details:</h3>
              <p><strong>Date:</strong> ${reservationData.arrivalDate}</p>
              <p><strong>Time:</strong> ${reservationData.arrivalTime}</p>
              <p><strong>Table:</strong> ${selectedTable?.table_number}</p>
              <p><strong>Guests:</strong> ${reservationData.numPeople}</p>
            </div>
            
            ${orderItemsHtml}
            
            <p style="color: #666; line-height: 1.6; margin-top: 20px;">
              Thank you for choosing Dine 24!
            </p>
          </div>
        </div>
      `;

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: reservationData.email,
          subject: "Your DINE24 Bill Preview",
          html: htmlContent,
          pdfAttachment: {
            filename: `Dine24-Bill-${reservationData.fullName.replace(/\s+/g, '_')}.pdf`,
            content: pdfContent.split(',')[1] // Remove data URL prefix
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Bill sent to your email successfully!",
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        title: "Error", 
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const subtotal = selectedItems.reduce((sum, item) => 
    sum + (item.offer_price || item.price) * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // Generate barcode pattern
  const generateBarcode = (text: string) => {
    const barcodePattern = text.split('').map((char, index) => 
      char.charCodeAt(0) % 2 === 0 ? '|' : '||'
    ).join('');
    return `|||${barcodePattern}|||`;
  };

  const reservationId = `RES${Date.now().toString().slice(-8)}`;
  const barcode = generateBarcode(reservationId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-black'
      }`}>
        <CardHeader className={`${
          theme === 'dark' 
            ? 'bg-royal-gold/20 text-royal-gold border-gray-700' 
            : 'bg-royal-gold text-black'
        } relative`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center">Bill Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Restaurant Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-royal-gold font-playfair tracking-wider">DINE24</h2>
            <p className="text-sm text-muted-foreground">Premium Dining Experience</p>
            <p className="text-xs">Phone: +91 98765 43210 | Email: info@dine24.com</p>
            
            {/* Barcode Section */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="font-mono text-xs mb-2" style={{ letterSpacing: '1px' }}>
                {barcode}
              </div>
              <p className="text-xs text-muted-foreground">Reservation ID: {reservationId}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            {/* Customer Details */}
            <div>
              <h3 className="font-semibold text-royal-gold mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {reservationData.fullName}</p>
                <p><span className="font-medium">Email:</span> {reservationData.email}</p>
                <p><span className="font-medium">Phone:</span> {reservationData.phone}</p>
                <p><span className="font-medium">Date:</span> {reservationData.arrivalDate}</p>
                <p><span className="font-medium">Time:</span> {reservationData.arrivalTime}</p>
                <p><span className="font-medium">Table:</span> {selectedTable?.table_number} ({reservationData.numPeople} people)</p>
              </div>
            </div>
            
            <Separator />
            
            {/* Order Details */}
            {selectedItems.length > 0 && (
              <>
                <div>
                  <h3 className="font-semibold text-royal-gold mb-2">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium text-sm border-b pb-1">
                      <span>Item</span>
                      <span>Qty</span>
                      <span>Price</span>
                      <span>Total</span>
                    </div>
                    {selectedItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="flex-1">{item.name}</span>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <span className="w-16 text-center">₹{item.offer_price || item.price}</span>
                        <span className="w-16 text-right">₹{(item.offer_price || item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-royal-gold">₹{total}</span>
                  </div>
                </div>
                
                <Separator />
              </>
            )}
            
            {/* Disclaimer */}
            <div className={`p-3 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-yellow-900/20 border border-yellow-700 text-yellow-200' 
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}>
              <p className="font-semibold mb-1">⚠️ Important Dining Policy:</p>
              <p>You are allowed to have your meal within 1 hour from service start. Extended dining beyond this limit will incur an additional 15% charge of the total bill amount.</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button onClick={generatePDF} className="flex-1 btn-royal">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={sendEmail} variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillPreview;
