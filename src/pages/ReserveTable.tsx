import { useState } from "react";
import ReservationForm from "@/components/ReservationForm";
import TableSelection from "@/components/TableSelection";
import OrderSelection from "@/components/OrderSelection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateReservationPDF } from "@/utils/pdfGenerator";

interface ReservationData {
  fullName: string;
  email: string;
  phone: string;
  numPeople: number;
  purpose: string;
  arrivalTime: string;
  arrivalDate: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: string;
  price: number;
  offer_price?: number;
  category: string;
  rating: number;
  is_veg: boolean;
  selectedQuantity: number;
}

const ReserveTable = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [finalReservation, setFinalReservation] = useState<any>(null);
  const { toast } = useToast();

  const handleReservationSubmit = (data: ReservationData) => {
    setReservationData(data);
    setCurrentStep(2);
  };

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    setCurrentStep(3);
  };

  const handleTableAIRecommendation = async () => {
    if (!reservationData) return;
    
    try {
      const context = `Customer details: ${reservationData.numPeople} people, purpose: ${reservationData.purpose}. Please recommend the best table from our available tables.`;
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: "What table would you recommend for my reservation?",
          context
        }
      });

      if (error) throw error;

      toast({
        title: "AI Table Recommendation",
        description: data.response,
        duration: 10000,
      });
    } catch (error) {
      console.error('Error getting AI table recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to get AI table recommendations.",
        variant: "destructive",
      });
    }
  };

  const handleSkipOrdering = async () => {
    await completeReservation([]);
  };

  const handleOrderComplete = async (items: OrderItem[], total: number) => {
    setOrderItems(items);
    await completeReservation(items, 'now');
  };

  const completeReservation = async (items: OrderItem[], orderType: 'now' | 'later' = 'later') => {
    if (!reservationData || !selectedTable) return;

    try {
      const subtotal = items.reduce((sum, item) => 
        sum + (item.offer_price || item.price) * item.selectedQuantity, 0);
      const gst = Math.round(subtotal * 0.18); // 18% GST
      const totalAmount = subtotal + gst;

      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert({
          full_name: reservationData.fullName,
          email: reservationData.email,
          phone: reservationData.phone,
          num_people: reservationData.numPeople,
          purpose: reservationData.purpose,
          arrival_time: reservationData.arrivalTime,
          arrival_date: reservationData.arrivalDate,
          table_number: selectedTable.table_number,
          table_capacity: selectedTable.seating_capacity,
          order_type: orderType,
          total_amount: totalAmount,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      // Add order items if any
      if (items.length > 0) {
        const reservationItems = items.map(item => ({
          reservation_id: reservation.id,
          menu_item_id: item.id,
          quantity: item.selectedQuantity,
          price: item.offer_price || item.price
        }));

        await supabase
          .from('reservation_items')
          .insert(reservationItems);
      }

      setFinalReservation(reservation);
      setCurrentStep(4);

      // Send email with PDF
      await sendConfirmationEmail(reservation, items);

      toast({
        title: "Reservation Confirmed!",
        description: "Your table has been reserved. Check your email for confirmation.",
      });
    } catch (error) {
      console.error('Error completing reservation:', error);
      toast({
        title: "Error",
        description: "Failed to complete reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendConfirmationEmail = async (reservation: any, items: OrderItem[]) => {
    try {
      const pdfContent = await generateReservationPDF(reservation, items);
      
      const subtotal = items.reduce((sum, item) => 
        sum + (item.offer_price || item.price) * item.selectedQuantity, 0);
      const gst = Math.round(subtotal * 0.18);
      const total = subtotal + gst;

      const orderItemsHtml = items.length > 0 ? `
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
            ${items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.selectedQuantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.offer_price || item.price}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(item.offer_price || item.price) * item.selectedQuantity}</td>
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

      await supabase.functions.invoke('send-email', {
        body: {
          to: reservation.email,
          subject: `🍽️ Table Reserved Successfully - Dine 24 Restaurant`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%); padding: 30px; text-align: center;">
                <h1 style="color: #000; margin: 0; font-size: 28px;">🍽️ DINE 24</h1>
                <p style="color: #333; margin: 10px 0 0 0; font-size: 16px;">Premium Dining Experience</p>
              </div>
              
              <div style="padding: 30px;">
                <h2 style="color: #d4af37; margin-bottom: 20px;">✅ Reservation Confirmed!</h2>
                
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Dear <strong>${reservation.full_name}</strong>,
                </p>
                
                <p style="color: #666; line-height: 1.6;">
                  We're delighted to confirm your table reservation at Dine 24. Your table has been successfully booked and we're looking forward to providing you with an exceptional dining experience.
                </p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #d4af37; margin-top: 0;">Reservation Details:</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 5px 0; color: #666;"><strong>Reservation ID:</strong></td>
                      <td style="padding: 5px 0; color: #333;">#${reservation.id.slice(0, 8).toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #666;"><strong>Date:</strong></td>
                      <td style="padding: 5px 0; color: #333;">${new Date(reservation.arrival_date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #666;"><strong>Time:</strong></td>
                      <td style="padding: 5px 0; color: #333;">${reservation.arrival_time}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #666;"><strong>Table Number:</strong></td>
                      <td style="padding: 5px 0; color: #333;">${reservation.table_number}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #666;"><strong>Number of Guests:</strong></td>
                      <td style="padding: 5px 0; color: #333;">${reservation.num_people}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #666;"><strong>Purpose:</strong></td>
                      <td style="padding: 5px 0; color: #333;">${reservation.purpose}</td>
                    </tr>
                  </table>
                </div>
                
                ${orderItemsHtml}
                
                <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #2d5a2d; margin: 0; font-weight: bold;">📋 Important Notes:</p>
                  <ul style="color: #2d5a2d; margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Please arrive on time for your reservation</li>
                    <li>Contact us at +91 98765 43210 if you need to make changes</li>
                    <li>Your detailed bill is attached as a PDF</li>
                    ${items.length > 0 ? '<li>Payment can be made upon arrival</li>' : ''}
                  </ul>
                </div>
                
                <p style="color: #666; line-height: 1.6; margin-top: 20px;">
                  Thank you for choosing Dine 24. We're committed to making your dining experience memorable and delightful.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #d4af37; font-weight: bold; margin: 0;">We look forward to serving you!</p>
                </div>
              </div>
              
              <div style="background-color: #333; padding: 20px; text-align: center;">
                <p style="color: #fff; margin: 0; font-size: 14px;">
                  📧 info@dine24.com | 📞 +91 98765 43210<br>
                  🍽️ Dine 24 - Where Every Meal is a Celebration
                </p>
              </div>
            </div>
          `,
          pdfAttachment: {
            filename: `Dine24-Reservation-${reservation.id.slice(0, 8)}.pdf`,
            content: pdfContent.split(',')[1] // Remove data URL prefix
          }
        }
      });

      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Error",
        description: "Reservation confirmed but email failed to send.",
        variant: "destructive",
      });
    }
  };

  const handleAISuggestion = async () => {
    try {
      const context = `Customer details: ${reservationData?.numPeople} people, purpose: ${reservationData?.purpose}. Please recommend the best dishes from our menu.`;
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: "What are the best dishes you recommend for my reservation?",
          context
        }
      });

      if (error) throw error;

      toast({
        title: "AI Recommendation",
        description: data.response,
        duration: 10000,
      });
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations.",
        variant: "destructive",
      });
    }
  };

  const downloadBill = async () => {
    if (!finalReservation) return;
    
    try {
      const pdfContent = await generateReservationPDF(finalReservation, orderItems);
      const link = document.createElement('a');
      link.href = pdfContent;
      link.download = `Dine24-Reservation-${finalReservation.id.slice(0, 8)}.pdf`;
      link.click();
      
      toast({
        title: "Download Started",
        description: "Your reservation bill is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Error",
        description: "Failed to download the bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step
                        ? 'bg-royal-gold text-black'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? 'bg-royal-gold' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <ReservationForm onSubmit={handleReservationSubmit} />
          )}

          {currentStep === 2 && reservationData && (
            <TableSelection
              reservationData={reservationData}
              onTableSelect={handleTableSelect}
              onAIRecommendation={handleTableAIRecommendation}
            />
          )}

          {currentStep === 3 && reservationData && selectedTable && (
            <div className="space-y-6">
              <Card className="card-royal">
                <CardHeader>
                  <CardTitle className="text-royal-gold text-center">
                    Choose Your Dining Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Would you like to pre-order your food or order after arrival?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      className="btn-royal"
                      onClick={handleSkipOrdering}
                    >
                      Order After Arrival
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <OrderSelection
                reservationData={reservationData}
                selectedTable={selectedTable}
                onOrderComplete={handleOrderComplete}
              />
            </div>
          )}

          {currentStep === 4 && finalReservation && (
            <Card className="card-royal text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-royal-gold text-2xl">
                  Reservation Confirmed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-royal-gold mb-4">Reservation Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Name:</strong> {finalReservation.full_name}</p>
                      <p><strong>Email:</strong> {finalReservation.email}</p>
                      <p><strong>Phone:</strong> {finalReservation.phone}</p>
                    </div>
                    <div>
                      <p><strong>Date:</strong> {finalReservation.arrival_date}</p>
                      <p><strong>Time:</strong> {finalReservation.arrival_time}</p>
                      <p><strong>Table:</strong> {finalReservation.table_number}</p>
                      <p><strong>Guests:</strong> {finalReservation.num_people}</p>
                    </div>
                  </div>
                  {orderItems.length > 0 && (
                    <div className="mt-4">
                      <p><strong>Total Amount:</strong> ₹{finalReservation.total_amount}</p>
                      <p className="text-sm text-muted-foreground">Payment: Pay on Arrival</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={downloadBill} className="btn-royal">
                    <Download className="h-4 w-4 mr-2" />
                    Download Bill PDF
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  A confirmation email with your reservation details and bill has been sent to {finalReservation.email}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReserveTable;
