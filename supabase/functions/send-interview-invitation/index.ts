import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InterviewInvitationRequest {
  candidateName: string;
  candidateEmail: string;
  interviewToken: string;
  availableSlots: Array<{
    date: string;
    times: string[];
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidateName, candidateEmail, interviewToken, availableSlots }: InterviewInvitationRequest = await req.json();

    console.log(`Sending interview invitation to: ${candidateEmail}`);

    // Format available slots for email
    const slotsHtml = availableSlots.map(slot => `
      <li style="margin-bottom: 10px;">
        <strong>${slot.date}</strong>: ${slot.times.join(', ')}
      </li>
    `).join('');

    const interviewLink = `https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/interview-scheduling/${interviewToken}`;

    const emailResponse = await resend.emails.send({
      from: "Kreative Theory <hello@kreativetheory.com>",
      to: [candidateEmail],
      subject: "Interview Invitation - Brand Experience & Merch Coordinator",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/lovable-uploads/eea14e13-0bac-48a9-87d3-e9761e9e0dfd.png" alt="Kreative Theory" style="max-width: 200px; height: auto;">
          </div>
          
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Great news, ${candidateName}!</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We're excited to invite you for an interview for the <strong>Brand Experience & Merch Coordinator</strong> position at Kreative Theory!
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We have the following time slots available:
          </p>
          
          <ul style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px; padding-left: 20px;">
            ${slotsHtml}
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${interviewLink}" style="background-color: #ec4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Schedule Your Interview
            </a>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Please click the button above to select your preferred time slot. We look forward to speaking with you!
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

    console.log("Interview invitation sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-interview-invitation function:", error);
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