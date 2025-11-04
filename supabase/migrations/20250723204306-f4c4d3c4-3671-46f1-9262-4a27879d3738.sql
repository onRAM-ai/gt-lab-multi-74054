-- Create website_quotes table for storing website quote requests
CREATE TABLE public.website_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  websites JSONB NOT NULL, -- Array of website objects with all details
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'New'
);

-- Enable RLS on website_quotes table
ALTER TABLE public.website_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for website_quotes table
CREATE POLICY "Allow public insert on website_quotes" 
ON public.website_quotes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read on website_quotes" 
ON public.website_quotes 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public update on website_quotes" 
ON public.website_quotes 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates on website_quotes
CREATE TRIGGER update_website_quotes_updated_at
BEFORE UPDATE ON public.website_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();