
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const formData = await req.json();
    console.log('JotForm webhook received:', formData);

    // Extrair dados do formulário
    const submissionData = formData.rawRequest || formData;
    
    // Buscar configuração do cliente baseado no form_id
    const { data: integration, error: integrationError } = await supabase
      .from('jotform_integrations')
      .select('*')
      .eq('form_id', submissionData.formID || 'aerocenter_business_cards')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.log('No integration found for form:', submissionData.formID);
      return new Response('No integration configured', { 
        status: 200,
        headers: corsHeaders 
      });
    }

    // Extrair informações do pedido
    const projectName = submissionData.q3_businessCard || 'Business Cards Order';
    const quantity = submissionData.q4_quantity || '500';
    const specialInstructions = submissionData.q5_special || '';
    const clientEmail = submissionData.q6_email || '';

    // Criar projeto automaticamente
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        name: `${projectName} - ${quantity} units`,
        client: integration.client_name,
        description: `Pedido via JotForm: ${specialInstructions}`,
        value: integration.project_template?.default_value || '$200',
        assigned_to: integration.auto_assign_user,
        status: 'Planning',
        progress: 0,
        due_date: new Date(Date.now() + (integration.project_template?.estimated_days || 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      return new Response('Error creating project', { 
        status: 500,
        headers: corsHeaders 
      });
    }

    // Criar tracking de produção
    const { error: trackingError } = await supabase
      .from('production_tracking')
      .insert([{
        project_id: project.id,
        status: 'design',
        estimated_delivery: project.due_date
      }]);

    if (trackingError) {
      console.error('Error creating production tracking:', trackingError);
    }

    // Criar alerta para novo pedido
    const { error: alertError } = await supabase
      .from('alerts')
      .insert([{
        type: 'new_order',
        project_id: project.id,
        message: `Novo pedido recebido via JotForm: ${project.name}`,
        priority: 'medium'
      }]);

    if (alertError) {
      console.error('Error creating alert:', alertError);
    }

    // Se tiver email do cliente, criar aprovação pendente
    if (clientEmail) {
      const { error: approvalError } = await supabase
        .from('client_approvals')
        .insert([{
          project_id: project.id,
          approval_type: 'design',
          status: 'pending',
          client_email: clientEmail
        }]);

      if (approvalError) {
        console.error('Error creating approval:', approvalError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      project_id: project.id,
      message: 'Project created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
})
