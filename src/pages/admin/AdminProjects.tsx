
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, User, DollarSign, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ProjectForm from '@/components/admin/forms/ProjectForm';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { supabase } from '@/integrations/supabase/client';

const AdminProjects = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: any }>({ open: false, project: null });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safe render function to handle objects and null values
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      // Handle name objects like {"first": "James", "last": "Jennings"}
      if (value.first && value.last) {
        return `${value.first} ${value.last}`.trim();
      }
      if (value.first) {
        return value.first;
      }
      // For other objects, convert to JSON string as fallback
      return JSON.stringify(value);
    }
    return String(value);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== projectId));
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedProject(null);
    fetchProjects();
  };

  const openEditForm = (project: any) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const updateStatus = (projectId: number) => {
    toast.info(`Updating status for project ID: ${projectId}`);
  };

  const viewDetails = (projectId: number) => {
    toast.info(`Viewing details for project ID: ${projectId}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading projects...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">Track and manage all client projects</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <ProjectForm
              project={selectedProject}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{safeRender(project.name)}</CardTitle>
                    <CardDescription>{safeRender(project.client)}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {safeRender(project.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="text-gray-600 mb-4">{safeRender(project.description)}</p>
                )}
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {project.due_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Due: {safeRender(project.due_date)}</span>
                    </div>
                  )}
                  {project.assigned_to && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{safeRender(project.assigned_to)}</span>
                    </div>
                  )}
                  {project.value && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{safeRender(project.value)}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {project.progress !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{safeRender(project.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewDetails(project.id)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditForm(project)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => updateStatus(project.id)}>
                      Update Status
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDeleteDialog({ open: true, project })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, project: null })}
          onConfirm={() => {
            handleDeleteProject(deleteDialog.project.id);
            setDeleteDialog({ open: false, project: null });
          }}
          title="Delete Project"
          description="Are you sure you want to delete"
          itemName={safeRender(deleteDialog.project?.name) || ''}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
