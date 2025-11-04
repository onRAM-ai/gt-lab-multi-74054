import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Interview {
  id: string;
  application_id: string;
  admin_available_slots: Array<{
    date: string;
    times: string[];
  }>;
  candidate_selected_slot: any;
  status: string;
  interview_token: string;
  created_at: string;
}

interface JobApplication {
  first_name: string;
  last_name: string;
  email: string;
}

const InterviewScheduling = () => {
  const { token } = useParams<{ token: string }>();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const { toast } = useToast();

  const { data: interview, isLoading, error } = useQuery({
    queryKey: ['interview', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');
      
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          job_applications:application_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('interview_token', token)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!token,
  });

  const scheduleInterview = useMutation({
    mutationFn: async (slot: any) => {
      if (!interview) throw new Error('No interview data');

      const { error } = await supabase
        .from('interviews')
        .update({
          candidate_selected_slot: slot,
          status: 'scheduled',
        })
        .eq('id', interview.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Interview scheduled!",
        description: "We'll send you a confirmation email with the details.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSchedule = () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        description: "Choose your preferred date and time for the interview.",
        variant: "destructive",
      });
      return;
    }

    const [date, time] = selectedSlot.split('|');
    scheduleInterview.mutate({ date, time });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Interview Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This interview scheduling link is invalid or has expired. Please contact us for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (interview.status === 'scheduled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600">Interview Already Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your interview has already been scheduled for:
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium">
                {formatDate(interview.candidate_selected_slot.date)} at {formatTime(interview.candidate_selected_slot.time)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applicationData = interview.job_applications as unknown as JobApplication;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src="https://09770bae-5926-436e-8d9b-f45ceb247cf6.lovableproject.com/lovable-uploads/eea14e13-0bac-48a9-87d3-e9761e9e0dfd.png" 
              alt="Kreative Theory" 
              className="mx-auto h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule Your Interview
          </h1>
          <p className="text-gray-600 mb-2">
            Hi {applicationData.first_name}! We're excited to meet with you.
          </p>
          <p className="text-gray-600">
            Please select your preferred time slot for the <strong>Brand Experience & Merch Coordinator</strong> interview.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Available Time Slots
            </CardTitle>
            <CardDescription>
              Select the date and time that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedSlot} onValueChange={setSelectedSlot}>
              {interview.admin_available_slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="space-y-2">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(slot.date)}
                  </h3>
                  <div className="ml-6 space-y-2">
                    {slot.times.map((time, timeIndex) => (
                      <div key={timeIndex} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={`${slot.date}|${time}`} 
                          id={`slot-${slotIndex}-${timeIndex}`}
                        />
                        <Label 
                          htmlFor={`slot-${slotIndex}-${timeIndex}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatTime(time)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-8 pt-6 border-t">
              <Button
                onClick={handleSchedule}
                disabled={!selectedSlot || scheduleInterview.isPending}
                className="w-full"
                size="lg"
              >
                {scheduleInterview.isPending ? 'Scheduling...' : 'Confirm Interview Time'}
              </Button>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>
                Need to reschedule or have questions? Contact us at{' '}
                <a href="mailto:hello@kreativetheory.com" className="text-blue-600 hover:underline">
                  hello@kreativetheory.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewScheduling;