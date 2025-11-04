
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  submissionId: string;
  submissionData: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { submissionId, submissionData }: RequestBody = await req.json();
    
    console.log('Creating project from submission:', submissionId);

    // Create the project for AeroCenter
    const projectData = {
      name: `Business Cards - ${submissionData.name || 'Customer'}`,
      client: 'AeroCenter',
      description: `Business card order from JotForm. Details: ${submissionData.special_instructions}`,
      value: '$150', // Default value for business cards
      status: 'Planning',
      assigned_to: 'Design Team',
      progress: 0,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };

    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      throw projectError;
    }

    console.log('Project created successfully:', project.id);

    // Store the JotForm submission reference
    const { error: integrationError } = await supabaseClient
      .from('jotform_integrations')
      .insert([{
        form_id: submissionData.form_id,
        client_name: 'AeroCenter',
        auto_assign_user: 'Design Team',
        project_template: {
          submission_id: submissionId,
          project_id: project.id,
          customer_name: submissionData.name,
          customer_email: submissionData.email,
          customer_phone: submissionData.phone,
          quantity: submissionData.quantity,
          fbo_name: submissionData.fbo_name,
          job_title: submissionData.job_title,
          logo_type: submissionData.logo_type
        }
      }]);

    if (integrationError) {
      console.error('Error creating integration record:', integrationError);
      // Don't throw here, project is already created
    }

    return new Response(JSON.stringify({
      success: true,
      project: project,
      message: 'Project created successfully from JotForm submission'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in create-project-from-submission function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create project',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
