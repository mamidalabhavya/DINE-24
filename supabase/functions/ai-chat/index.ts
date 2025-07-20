
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const geminiApiKey = "AIzaSyDxMU-juUP_0F-zlm13p782k0mdkCVZwk8";
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
    const { message, context } = await req.json();

    console.log('Received message:', message);
    console.log('Context:', context);

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Get menu data for context
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')
      .order('rating', { ascending: false });

    const menuContext = menuItems?.map(item => 
      `${item.name} (${item.category}) - ₹${item.offer_price || item.price} - Rating: ${item.rating} - ${item.is_veg ? 'Veg' : 'Non-Veg'}`
    ).join('\n') || '';

    // Check if user wants to navigate
    const navigationKeywords = ['menu', 'dishes', 'food', 'order', 'navigate to menu', 'show menu', 'see menu'];
    const shouldNavigateToMenu = navigationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    let systemPrompt = `You are a helpful assistant for Dine 24 restaurant. You can help with:
1. Food recommendations based on our menu
2. Table reservations (ask for name, email, phone, number of people)
3. General restaurant information
4. Navigation help

Our menu includes:
${menuContext}

Context about the user: ${context || 'No additional context'}

Be friendly, concise, and helpful. If asked about reservations, guide them through the process or suggest they use the reservation form.`;

    if (shouldNavigateToMenu) {
      systemPrompt += `\n\nIMPORTANT: The user wants to see the menu. Include this exact text in your response: "NAVIGATE_TO_MENU" so they can be redirected to the menu page.`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Could you please rephrase your question?";

    return new Response(JSON.stringify({ 
      response: generatedText,
      shouldNavigate: shouldNavigateToMenu ? 'menu' : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      response: "I'm experiencing some technical difficulties. Please try again later or contact our support team.",
      error: error.message 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
