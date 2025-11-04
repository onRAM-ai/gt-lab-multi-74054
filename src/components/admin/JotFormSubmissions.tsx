
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, FileText, Calendar, Mail, Phone, AlertCircle, Plus, CheckCircle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JotFormSubmission {
  id: string;
  form_id: string;
  created_at: string;
  status: string;
  business_card_type: string;
  quantity: string;
  special_instructions: string;
  email: string;
  phone?: string;
  ip: string;
  updated_at: string;
  name: string;
  job_title: string;
  fbo_name: string;
  logo_type: string;
  isProcessed?: boolean;
}

interface JotFormResponse {
  success: boolean;
  submissions: JotFormSubmission[];
  total: number;
  form_url: string;
  error?: string;
  details?: string;
}

const JotFormSubmissions = () => {
  const [submissions, setSubmissions] = useState<JotFormSubmission[]>([]);
  const [processedSubmissions, setProcessedSubmissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
    loadProcessedSubmissions();
  }, []);

  const loadProcessedSubmissions = () => {
    const processed = localStorage.getItem('jotform-processed') || '[]';
    try {
      const processedIds = JSON.parse(processed);
      setProcessedSubmissions(new Set(processedIds));
    } catch (error) {
      console.error('Error loading processed submissions:', error);
    }
  };

  const saveProcessedSubmissions = (processedIds: Set<string>) => {
    localStorage.setItem('jotform-processed', JSON.stringify([...processedIds]));
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching JotForm submissions...');
      
      const { data, error: functionError } = await supabase.functions.invoke('fetch-jotform-submissions');
      
      if (functionError) {
        console.error('Supabase function error:', functionError);
        setError('Failed to connect to JotForm service');
        return;
      }

      if (data && typeof data === 'object') {
        const response = data as JotFormResponse;
        
        if (response.success) {
          setSubmissions(response.submissions || []);
          setFormUrl(response.form_url || '');
          console.log(`Loaded ${response.submissions?.length || 0} submissions`);
          
          if (response.submissions && response.submissions.length > 0) {
            toast.success(`Loaded ${response.submissions.length} submissions`);
          } else {
            toast.info('No submissions found in JotForm');
          }
        } else {
          console.error('JotForm API error:', response.error, response.details);
          setError(response.error || 'Failed to fetch submissions');
          toast.error(response.error || 'Failed to fetch submissions');
        }
      } else {
        console.error('Invalid response format:', data);
        setError('Invalid response from JotForm service');
        toast.error('Invalid response from JotForm service');
      }
    } catch (error) {
      console.error('Error fetching JotForm submissions:', error);
      setError('Failed to fetch submissions');
      toast.error('Failed to connect to JotForm');
    } finally {
      setLoading(false);
    }
  };

  const markAsProcessed = (submissionId: string) => {
    const newProcessed = new Set(processedSubmissions);
    newProcessed.add(submissionId);
    setProcessedSubmissions(newProcessed);
    saveProcessedSubmissions(newProcessed);
    toast.success('Submission marked as processed');
  };

  const createProjectFromSubmission = async (submission: JotFormSubmission) => {
    setCreatingProject(submission.id);
    
    try {
      console.log('Creating project from submission:', submission.id);
      
      const { data, error: functionError } = await supabase.functions.invoke('create-project-from-submission', {
        body: {
          submissionId: submission.id,
          submissionData: submission
        }
      });
      
      if (functionError) {
        console.error('Error creating project:', functionError);
        toast.error('Failed to create project');
        return;
      }

      if (data && data.success) {
        toast.success(`Project created successfully for ${submission.name}!`);
        markAsProcessed(submission.id);
        fetchSubmissions();
      } else {
        console.error('Project creation failed:', data);
        toast.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setCreatingProject(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'overquota': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Filter out processed submissions to show only new ones
  const newSubmissions = submissions.filter(sub => !processedSubmissions.has(sub.id));

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              JotForm Submissions - New Orders ({newSubmissions.length})
            </CardTitle>
            <CardDescription>Business Card orders from JotForm - Auto-create projects for AeroCenter</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSubmissions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {formUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(formUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View in JotForm
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading submissions
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchSubmissions} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : newSubmissions.length > 0 ? (
          <div className="space-y-4">
            {newSubmissions.map((submission) => (
              <div 
                key={submission.id} 
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl hover:from-blue-100 hover:to-green-100 transition-all duration-200 hover:shadow-md border-l-4 border-blue-500"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {safeRender(submission.name)} - {safeRender(submission.job_title)}
                    </h4>
                    <Badge className="bg-green-100 text-green-800 animate-pulse" variant="secondary">
                      NEW
                    </Badge>
                    <Badge className={getStatusColor(submission.status)} variant="secondary">
                      {safeRender(submission.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(submission.created_at)}
                    </div>
                    <div>
                      <strong>FBO:</strong> {safeRender(submission.fbo_name) || 'Not specified'}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {safeRender(submission.quantity) || 'Not specified'}
                    </div>
                    {submission.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {safeRender(submission.email)}
                      </div>
                    )}
                    {submission.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {safeRender(submission.phone)}
                      </div>
                    )}
                    <div>
                      <strong>Logo:</strong> {safeRender(submission.logo_type) || 'Not specified'}
                    </div>
                  </div>
                  
                  {submission.special_instructions && (
                    <div className="mt-2 text-xs text-gray-500 bg-white p-2 rounded">
                      <strong>Details:</strong> {safeRender(submission.special_instructions)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => createProjectFromSubmission(submission)}
                    disabled={creatingProject === submission.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {creatingProject === submission.id ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Create Project
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsProcessed(submission.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Done
                  </Button>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">ID: {safeRender(submission.id)}</p>
                    {submission.ip && (
                      <p className="text-xs text-gray-400">IP: {safeRender(submission.ip)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500 mb-4">
              No new submissions to process. All submissions have been handled.
            </p>
            <Button onClick={fetchSubmissions} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check for New
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JotFormSubmissions;
