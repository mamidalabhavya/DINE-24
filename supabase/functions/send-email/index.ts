
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  pdfAttachment?: {
    filename: string;
    content: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called with method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, pdfAttachment }: EmailRequest = await req.json();

    console.log("Processing email request:", {
      to,
      subject: subject.substring(0, 50) + "...",
      hasPdfAttachment: !!pdfAttachment,
      attachmentSize: pdfAttachment?.content?.length || 0
    });

    // Validate email address
    if (!to || !to.includes('@')) {
      throw new Error('Invalid email address');
    }

    // Convert HTML content to plain text for RapidAPI (they don't support HTML in basic plan)
    const plainTextBody = html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    console.log("Sending email via RapidAPI...");

    // Use RapidAPI mail service
    const emailResponse = await fetch('https://rapidmail.p.rapidapi.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'rapidmail.p.rapidapi.com',
        'x-rapidapi-key': '326e070dfcmsh6923b1e0a96a942p1c4e42jsnd2c4d585bbd8'
      },
      body: JSON.stringify({
        ishtml: "false",
        sendto: to,
        name: "DINE24 Restaurant",
        replyTo: "info@dine24.com",
        title: subject,
        body: plainTextBody + "\n\n--- \nThis email was sent from DINE24 Restaurant Management System"
      })
    });

    const responseData = await emailResponse.text();
    console.log("RapidAPI response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(`RapidAPI error: ${emailResponse.status} - ${responseData}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully via RapidAPI",
        response: responseData
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Detailed error in send-email function:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        details: "Check function logs for more information"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
