import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  candidateName: string;
  candidateEmail: string;
  position: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Application confirmation email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidateName, candidateEmail, position }: EmailRequest = await req.json();
    
    console.log("Sending confirmation email to:", candidateEmail, "for position:", position);

    const emailResponse = await resend.emails.send({
      from: "Kreative Theory <hello@kreativetheory.com>",
      to: [candidateEmail],
      subject: `Application Received - ${position} Position`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/lovable-uploads/eea14e13-0bac-48a9-87d3-e9761e9e0dfd.png" alt="Kreative Theory" style="max-width: 150px; height: auto;" />
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${candidateName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">Thank you for your interest in Kreative Theory!</p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">We have received your resume/CV for the <strong>${position}</strong> position.</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">A member of our talent acquisition team will review your application and information and determine if there is a match between your resume and what the hiring team is looking for. Please be aware that it can take up to two weeks to receive an update from our team as we work to review applications. We are grateful for your patience as we determine candidacy.</p>
            
            <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px;">A note on scheduling interviews:</h3>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">At Kreative Theory, we're committed to creating a seamless and efficient recruitment process. As part of this effort, we have introduced automated scheduling for interviews in some regions and teams. While many interviews will be scheduled using this automated system, in some cases, our recruiters or Candidate Care Team may still contact you directly to coordinate interview times. Please monitor your email inbox for emails from hello@kreativetheory.com (including spam/junk folders) and your text messages for updates.</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">We appreciate your interest in pursuing Kreative Theory for your next career move!</p>
            
            <p style="margin-top: 30px; color: #555;">Sincerely,</p>
            <p style="color: #333;"><strong>Kreative Theory's Talent Acquisition Team</strong><br>
            <a href="https://kreativetheory.com/careers" style="color: #e91e63; text-decoration: none;">kreativetheory.com/careers</a><br>
            <span style="color: #e91e63; font-weight: bold;">#WeAreKreativeTheory</span></p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-confirmation function:", error);
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