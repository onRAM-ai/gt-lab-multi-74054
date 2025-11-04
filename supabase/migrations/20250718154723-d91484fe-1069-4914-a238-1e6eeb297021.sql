-- Create table for job applications
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  speaks_languages TEXT,
  linkedin TEXT,
  work_authorized TEXT NOT NULL,
  visa_sponsorship TEXT NOT NULL,
  signature TEXT NOT NULL,
  date DATE NOT NULL,
  gender TEXT NOT NULL,
  race_ethnicity TEXT NOT NULL,
  disability_status TEXT,
  veteran_status TEXT,
  privacy_policy_accepted BOOLEAN NOT NULL DEFAULT false,
  resume_url TEXT,
  resume_filename TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since it's a job application form)
CREATE POLICY "Allow public insert on job_applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read on job_applications" 
ON public.job_applications 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();