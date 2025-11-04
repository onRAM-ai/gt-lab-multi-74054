
-- Criar tabela para tracking de produção
CREATE TABLE public.production_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'design' CHECK (status IN ('design', 'client_approval', 'production', 'quality_check', 'ready', 'delivered')),
  notes TEXT,
  estimated_delivery DATE,
  actual_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para aprovações de clientes
CREATE TABLE public.client_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL DEFAULT 'design' CHECK (approval_type IN ('design', 'proof', 'final')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  client_email TEXT,
  approval_token UUID DEFAULT gen_random_uuid(),
  client_comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para integração JotForm
CREATE TABLE public.jotform_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  auto_assign_user TEXT,
  project_template JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para alertas e notificações
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('deadline_warning', 'overdue', 'approval_pending', 'new_order')),
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão para AeroCenter
INSERT INTO public.jotform_integrations (form_id, client_name, auto_assign_user, project_template) 
VALUES (
  'aerocenter_business_cards', 
  'AeroCenter', 
  'design_team',
  '{"type": "Business Cards", "default_value": "$200", "estimated_days": 3}'
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.production_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jotform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir acesso a todos usuários autenticados por enquanto)
CREATE POLICY "Allow all operations" ON public.production_tracking FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.client_approvals FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.jotform_integrations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.alerts FOR ALL USING (true);
