import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  client: z.string().min(1, 'Client is required'),
  description: z.string().optional(),
  value: z.string().optional(),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
  status: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      client: project?.client || '',
      description: project?.description || '',
      value: project?.value || '',
      due_date: project?.due_date || '',
      assigned_to: project?.assigned_to || '',
      status: project?.status || 'Planning',
    },
  });

  // Fetch clients from database
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('status', 'Active')
          .order('company');

        if (error) throw error;
        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search
  useEffect(() => {
    if (!clientSearch.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.company.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearch.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clientSearch, clients]);

  // Set initial selected client if editing
  useEffect(() => {
    if (project?.client && clients.length > 0) {
      const client = clients.find(c => c.company === project.client);
      if (client) {
        setSelectedClient(client);
        setClientSearch(client.company);
      }
    }
  }, [project, clients]);

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setClientSearch(client.company);
    form.setValue('client', client.company);
    setShowClientDropdown(false);
  };

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value);
    form.setValue('client', value);
    setShowClientDropdown(true);
    
    // Clear selected client if search doesn't match
    if (selectedClient && !selectedClient.company.toLowerCase().includes(value.toLowerCase())) {
      setSelectedClient(null);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        toast.error('Project name is required');
        return;
      }
      if (!data.client?.trim()) {
        toast.error('Client is required');
        return;
      }

      const projectData = {
        name: data.name.trim(),
        client: data.client.trim(),
        description: data.description?.trim() || null,
        value: data.value?.trim() || '$0',
        due_date: data.due_date || null,
        assigned_to: data.assigned_to?.trim() || null,
        status: data.status || 'Planning',
        progress: project?.progress || 0,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (project) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
          .select();
      } else {
        // Create new project
        result = await supabase
          .from('projects')
          .insert([projectData])
          .select();
      }

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('No data returned from database operation');
      }

      const action = project ? 'updated' : 'created';
      toast.success(`Project ${action} successfully!`);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMessage = error?.message || 'An unexpected error occurred';
      toast.error(`Error saving project: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {project ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search and select client..."
                        value={clientSearch}
                        onChange={(e) => handleClientSearchChange(e.target.value)}
                        onFocus={() => setShowClientDropdown(true)}
                        className="pl-10"
                      />
                    </div>
                    
                    {selectedClient && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md flex items-center justify-between">
                        <div className="text-sm">
                          <div className="font-medium">{selectedClient.company}</div>
                          <div className="text-gray-500">{selectedClient.name} • {selectedClient.email}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(null);
                            setClientSearch('');
                            form.setValue('client', '');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {showClientDropdown && filteredClients.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => handleClientSelect(client)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                          >
                            <div className="font-medium">{client.company}</div>
                            <div className="text-sm text-gray-500">{client.name} • {client.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.client?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Project description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input placeholder="Project value" {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.value?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.due_date?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <FormControl>
                  <Input placeholder="Assigned to" {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.assigned_to?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select className="rounded-md border border-gray-200 px-3 py-2 w-full" {...field}>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </FormControl>
                <FormMessage>{form.formState.errors.status?.message}</FormMessage>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ProjectForm;
