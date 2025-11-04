
-- Criar tabela para clientes
CREATE TABLE public.clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT,
  itin TEXT,
  status TEXT DEFAULT 'Active',
  industry TEXT,
  projects INTEGER DEFAULT 0,
  total_value TEXT DEFAULT '$0',
  last_contact DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para projetos
CREATE TABLE public.projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT DEFAULT 'Planning',
  due_date DATE,
  assigned_to TEXT,
  value TEXT DEFAULT '$0',
  progress INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para usuários
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'viewer',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para as novas tabelas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público (para o painel administrativo)
CREATE POLICY "Allow public access on clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow public access on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow public access on users" ON public.users FOR ALL USING (true);

-- Inserir alguns dados de exemplo
INSERT INTO public.clients (name, company, email, phone, website, address, itin, status, industry, projects, total_value, last_contact) VALUES
('AeroLux Aviation', 'AeroLux Aviation Inc.', 'contact@aerolux.com', '(555) 123-4567', 'www.aerolux.com', '123 Airport Blvd, Miami, FL 33101', 'XX-XXXXXXX', 'Active', 'Private Aviation', 5, '$125,000', '2024-01-15'),
('Sky Elite Jets', 'Sky Elite Jets LLC', 'info@skyeite.com', '(555) 987-6543', 'www.skyelitejets.com', '456 Executive Way, Orlando, FL 32801', 'XX-XXXXXXX', 'Active', 'Aviation Services', 3, '$85,000', '2024-01-14'),
('Premium Air Services', 'Premium Air Services Corp', 'hello@premiumair.com', '(555) 456-7890', 'www.premiumair.com', '789 Flight Center Dr, Tampa, FL 33607', 'XX-XXXXXXX', 'Inactive', 'Aircraft Maintenance', 2, '$45,000', '2024-01-10');

INSERT INTO public.projects (name, client, status, due_date, assigned_to, value, progress, description) VALUES
('AeroLux Fleet Branding', 'AeroLux Aviation', 'In Progress', '2024-02-15', 'Maria Garcia', '$45,000', 65, 'Complete fleet branding package including aircraft decals, uniforms, and promotional materials'),
('Sky Elite Corporate Event', 'Sky Elite Jets', 'Planning', '2024-02-28', 'John Smith', '$25,000', 30, 'Annual corporate retreat planning and branded merchandise for 200+ executives'),
('Premium Air Merchandise', 'Premium Air Services', 'Completed', '2024-01-10', 'Sarah Johnson', '$15,000', 100, 'Custom branded merchandise for maintenance crew and office staff');

INSERT INTO public.users (name, email, role, status) VALUES
('Admin User', 'admin@kreativetheory.com', 'admin', 'Active'),
('John Smith', 'john@kreativetheory.com', 'manager', 'Active'),
('Maria Garcia', 'maria@kreativetheory.com', 'viewer', 'Active'),
('Sarah Johnson', 'sarah@kreativetheory.com', 'viewer', 'Inactive');
