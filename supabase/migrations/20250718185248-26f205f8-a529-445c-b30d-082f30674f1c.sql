-- Add status column to job_applications table
ALTER TABLE public.job_applications 
ADD COLUMN status TEXT DEFAULT 'Under Review';

-- Create interviews table for scheduling
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  admin_available_slots JSONB NOT NULL, -- Array of available date/time slots from admin
  candidate_selected_slot JSONB NULL, -- Selected slot by candidate
  interview_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'cancelled'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on interviews table
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Create policies for interviews table
CREATE POLICY "Allow public read on interviews" 
ON public.interviews 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on interviews" 
ON public.interviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on interviews" 
ON public.interviews 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates on interviews
CREATE TRIGGER update_interviews_updated_at
BEFORE UPDATE ON public.interviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();