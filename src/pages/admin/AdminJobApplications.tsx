import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, User, Mail, Phone, Calendar, Eye, UserCheck, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface JobApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  phone: string;
  speaks_languages: string;
  linkedin: string;
  work_authorized: string;
  visa_sponsorship: string;
  signature: string;
  date: string;
  gender: string;
  race_ethnicity: string;
  disability_status: string;
  veteran_status: string;
  privacy_policy_accepted: boolean;
  resume_url: string;
  resume_filename: string;
  created_at: string;
  status: string;
}

const AdminJobApplications = () => {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [interviewSlots, setInterviewSlots] = useState([{ date: '', times: [''] }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JobApplication[];
    }
  });

  const downloadResume = async (resumeUrl: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl.replace('resumes/', ''));

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  // Mutation para notificar candidato quando aplicação é aberta
  const notifyApplicationOpened = useMutation({
    mutationFn: async (application: JobApplication) => {
      const { error } = await supabase.functions.invoke('notify-application-opened', {
        body: {
          candidateName: `${application.first_name} ${application.last_name}`,
          candidateEmail: application.email,
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notification sent",
        description: "Candidate has been notified that their application is under review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send notification to candidate.",
        variant: "destructive",
      });
    },
  });

  // Mutation para enviar convite de entrevista
  const sendInterviewInvitation = useMutation({
    mutationFn: async ({ application, slots }: { application: JobApplication, slots: any[] }) => {
      // Criar registro na tabela interviews
      const { data: interview, error: insertError } = await supabase
        .from('interviews')
        .insert({
          application_id: application.id,
          admin_available_slots: slots,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Enviar email de convite
      const { error: emailError } = await supabase.functions.invoke('send-interview-invitation', {
        body: {
          candidateName: `${application.first_name} ${application.last_name}`,
          candidateEmail: application.email,
          interviewToken: interview.interview_token,
          availableSlots: slots,
        },
      });

      if (emailError) throw emailError;

      // Atualizar status da aplicação para "Interviewing"
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ status: 'Interviewing' })
        .eq('id', application.id);

      if (updateError) throw updateError;

      return interview;
    },
    onSuccess: () => {
      toast({
        title: "Interview invitation sent",
        description: "Candidate has been invited to schedule an interview.",
      });
      setShowInterviewDialog(false);
      setInterviewSlots([{ date: '', times: [''] }]);
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send interview invitation.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewApplication = async (application: JobApplication) => {
    setSelectedApplication(application);
    
    // Enviar notificação se ainda não foi enviada (status Under Review)
    if (application.status === 'Under Review') {
      notifyApplicationOpened.mutate(application);
    }
  };

  const addInterviewSlot = () => {
    setInterviewSlots([...interviewSlots, { date: '', times: [''] }]);
  };

  const removeInterviewSlot = (index: number) => {
    if (interviewSlots.length > 1) {
      setInterviewSlots(interviewSlots.filter((_, i) => i !== index));
    }
  };

  const updateInterviewSlot = (index: number, field: 'date' | 'times', value: any) => {
    const updated = [...interviewSlots];
    if (field === 'times') {
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
    setInterviewSlots(updated);
  };

  const addTimeSlot = (slotIndex: number) => {
    const updated = [...interviewSlots];
    updated[slotIndex].times.push('');
    setInterviewSlots(updated);
  };

  const removeTimeSlot = (slotIndex: number, timeIndex: number) => {
    const updated = [...interviewSlots];
    if (updated[slotIndex].times.length > 1) {
      updated[slotIndex].times.splice(timeIndex, 1);
      setInterviewSlots(updated);
    }
  };

  const handleSendInterviewInvitation = () => {
    if (!selectedApplication) return;
    
    // Validar se todos os campos estão preenchidos
    const isValid = interviewSlots.every(slot => 
      slot.date && slot.times.every(time => time.trim() !== '')
    );
    
    if (!isValid) {
      toast({
        title: "Error",
        description: "Please fill in all dates and times.",
        variant: "destructive",
      });
      return;
    }

    sendInterviewInvitation.mutate({
      application: selectedApplication,
      slots: interviewSlots,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'Interviewing':
        return <Badge variant="default">Interviewing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job applications...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">Error loading job applications</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground">
            Manage and review job applications from candidates
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applications ({applications?.length || 0})
            </CardTitle>
            <CardDescription>
              All job applications submitted through the careers page
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Work Auth</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.first_name} {application.last_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {application.email}
                        </div>
                      </TableCell>
                      <TableCell>{application.city}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        <Badge variant={application.work_authorized === 'Yes' ? 'default' : 'secondary'}>
                          {application.work_authorized}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.resume_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadResume(application.resume_url, application.resume_filename)}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        ) : (
                          <span className="text-gray-400">No resume</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(application.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewApplication(application)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Job Application - {application.first_name} {application.last_name}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Personal Information</h3>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedApplication.first_name} {selectedApplication.last_name}</p>
                                        <p><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                                        <p><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                                        <p><span className="font-medium">City:</span> {selectedApplication.city}</p>
                                        <p><span className="font-medium">Languages:</span> {selectedApplication.speaks_languages || 'Not specified'}</p>
                                        <p><span className="font-medium">LinkedIn:</span> {selectedApplication.linkedin || 'Not provided'}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold mb-2">Work Authorization</h3>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Work Authorized:</span> {selectedApplication.work_authorized}</p>
                                        <p><span className="font-medium">Visa Sponsorship:</span> {selectedApplication.visa_sponsorship}</p>
                                        <p><span className="font-medium">Application Date:</span> {selectedApplication.date}</p>
                                        <p><span className="font-medium">Signature:</span> {selectedApplication.signature}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-semibold mb-2">Diversity Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <p><span className="font-medium">Gender:</span> {selectedApplication.gender}</p>
                                      <p><span className="font-medium">Race/Ethnicity:</span> {selectedApplication.race_ethnicity}</p>
                                      <p><span className="font-medium">Disability Status:</span> {selectedApplication.disability_status || 'Not specified'}</p>
                                      <p><span className="font-medium">Veteran Status:</span> {selectedApplication.veteran_status || 'Not specified'}</p>
                                    </div>
                                  </div>

                                  {selectedApplication.resume_url && (
                                    <div>
                                      <h3 className="font-semibold mb-2">Resume</h3>
                                      <Button
                                        onClick={() => downloadResume(selectedApplication.resume_url, selectedApplication.resume_filename)}
                                        className="flex items-center gap-2"
                                      >
                                        <FileText className="h-4 w-4" />
                                        Download Resume ({selectedApplication.resume_filename})
                                      </Button>
                                    </div>
                                  )}

                                  <div className="text-xs text-gray-500">
                                    <p>Submitted on: {formatDate(selectedApplication.created_at)}</p>
                                    <p>Privacy Policy Accepted: {selectedApplication.privacy_policy_accepted ? 'Yes' : 'No'}</p>
                                  </div>

                                  <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                      onClick={() => setShowInterviewDialog(true)}
                                      className="flex items-center gap-2"
                                      disabled={selectedApplication.status === 'Interviewing'}
                                    >
                                      <UserCheck className="h-4 w-4" />
                                      {selectedApplication.status === 'Interviewing' ? 'Interview Sent' : 'Invite to Interview'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No job applications found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interview Scheduling Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure available dates and times for the interview. The candidate will receive an email to choose their preferred slot.
            </p>
            
            {interviewSlots.map((slot, slotIndex) => (
              <div key={slotIndex} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Date {slotIndex + 1}</Label>
                  {interviewSlots.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInterviewSlot(slotIndex)}
                    >
                      Remove Date
                    </Button>
                  )}
                </div>
                
                <div>
                  <Label htmlFor={`date-${slotIndex}`}>Date</Label>
                  <Input
                    id={`date-${slotIndex}`}
                    type="date"
                    value={slot.date}
                    onChange={(e) => updateInterviewSlot(slotIndex, 'date', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Available Times</Label>
                  <div className="space-y-2 mt-2">
                    {slot.times.map((time, timeIndex) => (
                      <div key={timeIndex} className="flex gap-2 items-center">
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const updatedTimes = [...slot.times];
                            updatedTimes[timeIndex] = e.target.value;
                            updateInterviewSlot(slotIndex, 'times', updatedTimes);
                          }}
                          className="flex-1"
                        />
                        {slot.times.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(slotIndex, timeIndex)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(slotIndex)}
                    className="mt-2"
                  >
                    Add Time
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addInterviewSlot}
              className="w-full"
            >
              Add Another Date
            </Button>
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSendInterviewInvitation}
                disabled={sendInterviewInvitation.isPending}
                className="flex-1"
              >
                {sendInterviewInvitation.isPending ? 'Sending...' : 'Send Interview Invitation'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInterviewDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminJobApplications;