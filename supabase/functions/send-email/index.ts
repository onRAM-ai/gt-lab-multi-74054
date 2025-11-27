import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company: string;
  message: string;
  testingType?: string;
  sampleQuantity?: string;
  testingTimeline?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Received form data:", { ...formData, email: "[REDACTED]" });

    // Validate required fields
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize inputs (basic HTML escaping)
    const sanitize = (str: string) => 
      str.replace(/[&<>"']/g, (char) => {
        const escapeMap: { [key: string]: string } = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return escapeMap[char];
      });

    const name = sanitize(formData.name);
    const email = formData.email;
    const phone = formData.phone ? sanitize(formData.phone) : "Not provided";
    const company = sanitize(formData.company);
    const message = sanitize(formData.message);
    const testingType = formData.testingType ? sanitize(formData.testingType) : "Not specified";
    const sampleQuantity = formData.sampleQuantity ? sanitize(formData.sampleQuantity) : "Not specified";
    const testingTimeline = formData.testingTimeline ? sanitize(formData.testingTimeline) : "Not specified";

    // Prepare email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #3b82f6; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Testing Services Inquiry</h2>
            <p>Goldfields Testing Laboratory</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Contact Information</div>
                <div class='value'>
                    <strong>Name:</strong> ${name}<br>
                    <strong>Email:</strong> ${email}<br>
                    <strong>Phone:</strong> ${phone}<br>
                    <strong>Company:</strong> ${company}
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>Testing Requirements</div>
                <div class='value'>
                    <strong>Testing Type:</strong> ${testingType}<br>
                    <strong>Sample Quantity:</strong> ${sampleQuantity}<br>
                    <strong>Timeline:</strong> ${testingTimeline}
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>Project Details</div>
                <div class='value'>${message}</div>
            </div>
        </div>
    </div>
</body>
</html>
`;

    console.log("Sending email to labmanager@gtlab.com.au");

    const emailResponse = await resend.emails.send({
      from: "Goldfields Testing Lab <onboarding@resend.dev>",
      to: ["labmanager@gtlab.com.au"],
      subject: `New Testing Inquiry from ${name} - ${company}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
