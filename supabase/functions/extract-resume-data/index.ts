import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

console.log('OpenAI API Key configured:', !!openAIApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Request received, method:', req.method);
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    console.log('File received:', file?.name, file?.type, file?.size);
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For PDFs, we'll use a text-based approach since OpenAI vision doesn't support PDFs directly
    if (file.type === 'application/pdf') {
      console.log('Processing PDF file with text extraction approach');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a resume parser. Since I cannot process the PDF directly, please ask the user to either upload an image version of their resume (JPG, PNG) or manually fill out the form. Return this JSON response:
              {
                "firstName": null,
                "lastName": null,
                "email": null,
                "city": null,
                "phone": null,
                "message": "Please upload an image version of your resume (JPG or PNG) for automatic data extraction, or fill out the form manually."
              }`
            },
            {
              role: 'user',
              content: 'I uploaded a PDF resume'
            }
          ],
          max_tokens: 200,
          temperature: 0.1
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify({
        firstName: null,
        lastName: null,
        email: null,
        city: null,
        phone: null,
        message: "Please upload an image version of your resume (JPG or PNG) for automatic data extraction, or fill out the form manually."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert image file to base64 for OpenAI vision
    console.log('Processing image file with vision API');
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a resume parser. Extract the following information from the resume and return it as JSON:
            {
              "firstName": "string or null",
              "lastName": "string or null", 
              "email": "string or null",
              "city": "string or null",
              "phone": "string or null"
            }
            
            Only extract information that is clearly present. Return null for fields that cannot be found. 
            For phone numbers, format them as (XXX) XXX-XXXX if possible.
            For names, extract just the first and last name (not middle names).
            For city, extract just the city name (not state or country).`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract the personal information from this resume:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${file.type};base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);
    let extractedData;
    
    try {
      const content = data.choices[0].message.content;
      console.log('Raw OpenAI content:', content);
      extractedData = JSON.parse(content);
      console.log('Parsed extracted data:', extractedData);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content);
      extractedData = {
        firstName: null,
        lastName: null,
        email: null,
        city: null,
        phone: null
      };
    }

    console.log('Returning extracted data:', extractedData);
    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in extract-resume-data function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to extract resume data',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});