
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, numPeople, orderItems } = await req.json();

    // Find available table
    const { data: availableTables } = await supabase
      .from('restaurant_tables')
      .select('*')
      .gte('seating_capacity', numPeople)
      .eq('is_available', true)
      .order('seating_capacity', { ascending: true })
      .limit(1);

    if (!availableTables || availableTables.length === 0) {
      return new Response(JSON.stringify({ error: 'No available tables' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const selectedTable = availableTables[0];

    // Create reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        full_name: name,
        email,
        phone,
        num_people: numPeople,
        purpose: 'Quick Order',
        arrival_time: new Date().toTimeString().slice(0, 5),
        arrival_date: new Date().toISOString().split('T')[0],
        table_number: selectedTable.table_number,
        table_capacity: selectedTable.seating_capacity,
        order_type: 'now',
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) throw error;

    // Add order items if provided
    if (orderItems && orderItems.length > 0) {
      const reservationItems = orderItems.map((item: any) => ({
        reservation_id: reservation.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.offer_price || item.price
      }));

      await supabase
        .from('reservation_items')
        .insert(reservationItems);

      const totalAmount = orderItems.reduce((sum: number, item: any) => 
        sum + (item.offer_price || item.price) * item.quantity, 0);

      await supabase
        .from('reservations')
        .update({ total_amount: totalAmount })
        .eq('id', reservation.id);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      reservation,
      table: selectedTable 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in quick-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
