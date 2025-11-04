import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  candidateName: string;
  candidateEmail: string;
  position: string;
  applicationDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Admin notification email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidateName, candidateEmail, position, applicationDate }: NotificationRequest = await req.json();
    
    console.log("Sending admin notification for application from:", candidateName);

    const emailResponse = await resend.emails.send({
      from: "Kreative Theory <hello@kreativetheory.com>",
      to: ["hello@kreativetheory.com"],
      subject: `New Job Application - ${position}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/lovable-uploads/eea14e13-0bac-48a9-87d3-e9761e9e0dfd.png" alt="Kreative Theory" style="max-width: 150px; height: auto;" />
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">New Job Application Received</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Application Details:</h3>
              <p style="color: #555; line-height: 1.6; margin: 8px 0;"><strong>Candidate:</strong> ${candidateName}</p>
              <p style="color: #555; line-height: 1.6; margin: 8px 0;"><strong>Email:</strong> ${candidateEmail}</p>
              <p style="color: #555; line-height: 1.6; margin: 8px 0;"><strong>Position:</strong> ${position}</p>
              <p style="color: #555; line-height: 1.6; margin: 8px 0;"><strong>Application Date:</strong> ${applicationDate}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              A new job application has been submitted through the website. 
              Please log into the admin panel to review the complete application and download the resume.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/_adminpanel/job-applications" 
                 style="background-color: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Application in Admin Panel
              </a>
            </div>
            
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
              This is an automated notification from the Kreative Theory job application system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-application function:", error);
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