import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  candidateName: string;
  candidateEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidateName, candidateEmail }: NotificationRequest = await req.json();

    console.log(`Sending application review notification to: ${candidateEmail}`);

    const emailResponse = await resend.emails.send({
      from: "Kreative Theory <hello@kreativetheory.com>",
      to: [candidateEmail],
      subject: "Your application is under review - Brand Experience & Merch Coordinator",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/lovable-uploads/eea14e13-0bac-48a9-87d3-e9761e9e0dfd.png" alt="Kreative Theory" style="max-width: 200px; height: auto;">
          </div>
          
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Hi ${candidateName},</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your interest in the <strong>Brand Experience & Merch Coordinator</strong> position at Kreative Theory!
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We wanted to let you know that we have received your application and our team is currently reviewing it. We appreciate the time you took to apply and share your qualifications with us.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We will be in touch soon with next steps. If you have any questions in the meantime, please don't hesitate to reach out.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Best regards,<br>
            <strong>The Kreative Theory Team</strong>
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #888; font-size: 14px;">
            <p>Kreative Theory</p>
            <p>hello@kreativetheory.com</p>
          </div>
        </div>
      `,
    });

    console.log("Application review notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-application-opened function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);