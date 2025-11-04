
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, UserCheck, Mail, Phone, Building } from 'lucide-react';
import { toast } from 'sonner';
import LeadForm from '@/components/admin/forms/LeadForm';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { supabase } from '@/integrations/supabase/client';

const AdminLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; lead: any }>({ open: false, lead: null });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      
      setLeads(leads.filter(lead => lead.id !== leadId));
      toast.success('Lead deleted successfully!');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Error deleting lead');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
    fetchLeads();
  };

  const convertToClient = async (lead: any) => {
    try {
      // Create client from lead data
      const { error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: lead.name,
          company: lead.company || lead.name,
          email: lead.email,
          phone: lead.phone,
          industry: 'From Lead',
          status: 'Active'
        }]);

      if (clientError) throw clientError;

      // Update lead status to converted
      const { error: leadError } = await supabase
        .from('leads')
        .update({ status: 'Converted' })
        .eq('id', lead.id);

      if (leadError) throw leadError;

      fetchLeads();
      toast.success(`${lead.name} converted to client successfully!`);
    } catch (error) {
      console.error('Error converting lead:', error);
      toast.error('Error converting lead to client');
    }
  };

  const openEditForm = (lead: any) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading leads...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
            <p className="mt-2 text-gray-600">Track and manage potential clients</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <LeadForm
              lead={selectedLead}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leads Grid */}
        <div className="grid gap-6">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      <CardDescription>{lead.company}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{lead.source || 'Website'}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <strong>Message:</strong> {lead.message}
                </div>

                {lead.notes && (
                  <div className="text-sm text-gray-600 mb-4">
                    <strong>Notes:</strong> {lead.notes}
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditForm(lead)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {lead.status !== 'Converted' && (
                      <Button size="sm" onClick={() => convertToClient(lead)}>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Convert to Client
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDeleteDialog({ open: true, lead })}
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
          onOpenChange={(open) => setDeleteDialog({ open, lead: null })}
          onConfirm={() => {
            handleDeleteLead(deleteDialog.lead.id);
            setDeleteDialog({ open: false, lead: null });
          }}
          title="Delete Lead"
          description="Are you sure you want to delete"
          itemName={deleteDialog.lead?.name || ''}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
