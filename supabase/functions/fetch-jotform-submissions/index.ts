
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting JotForm fetch...');
    
    const apiKey = Deno.env.get('JOTFORM_API_KEY');
    if (!apiKey) {
      console.error('JOTFORM_API_KEY not found in environment');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'JotForm API key not configured' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('API Key found, length:', apiKey.length);

    // Form ID for Business Card submissions
    const formId = '230805143110035';
    const apiUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&limit=5&orderby=created_at`;
    
    console.log('Making request to JotForm API for last 5 submissions');
    
    // Fetch submissions from JotForm API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('JotForm API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('JotForm API error response:', errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `JotForm API error: ${response.status} - ${response.statusText}`,
        details: errorText
      }), { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log('JotForm API response received');
    console.log('Total submissions in response:', data.content?.length || 0);

    // Check if we have content
    if (!data.content || !Array.isArray(data.content)) {
      console.log('No content array found in response');
      return new Response(JSON.stringify({ 
        success: true, 
        submissions: [],
        total: 0,
        form_url: `https://www.jotform.com/tables/${formId}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Transform submissions to a cleaner format
    const submissions = data.content.map((submission: any) => {
      console.log('Processing submission:', submission.id);
      
      // Extract answers safely
      const answers = submission.answers || {};
      
      // Process name field properly - handle both string and object formats
      const nameField = answers['5']?.answer || answers['5']?.prettyFormat || {};
      let fullName = 'Unknown';
      
      if (typeof nameField === 'object' && nameField.first) {
        // Handle object format: {"first": "James", "last": "Jennings"}
        const firstName = nameField.first || '';
        const lastName = nameField.last || '';
        fullName = `${firstName} ${lastName}`.trim();
      } else if (typeof nameField === 'string') {
        // Handle string format
        fullName = nameField;
      }
      
      console.log('Processed name:', fullName);
      
      // Map the form fields to meaningful data
      const jobTitle = answers['6']?.answer || '';
      const fboName = answers['7']?.answer || '';
      const email = answers['14']?.answer || answers['46']?.answer || '';
      const phone = answers['8']?.answer || '';
      const quantity = answers['45']?.answer || 'Not specified';
      const logoType = answers['29']?.answer || '';
      
      return {
        id: submission.id,
        form_id: submission.form_id,
        created_at: submission.created_at,
        status: submission.status,
        business_card_type: `Business Cards - ${fboName || 'FBO'}`,
        quantity: quantity,
        special_instructions: `Name: ${fullName}, Job: ${jobTitle}, Logo: ${logoType}`,
        email: email,
        phone: phone,
        ip: submission.ip,
        updated_at: submission.updated_at,
        name: fullName,
        job_title: jobTitle,
        fbo_name: fboName,
        logo_type: logoType
      };
    });

    console.log('Transformed submissions:', submissions.length);

    return new Response(JSON.stringify({ 
      success: true, 
      submissions,
      total: submissions.length,
      form_url: `https://www.jotform.com/tables/${formId}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in JotForm function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error',
      details: error.message
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
