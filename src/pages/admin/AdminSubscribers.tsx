
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Download, Plus, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useForm } from 'react-hook-form';

const AdminSubscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; subscriber: any }>({ open: false, subscriber: null });

  const { register, handleSubmit, reset } = useForm();

  const loadSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading subscribers:', error);
        return;
      }

      setSubscribers(data || []);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSubscriber = async (subscriberId: number) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) {
        console.error('Error deleting subscriber:', error);
        toast.error('Error deleting subscriber');
        return;
      }

      await loadSubscribers();
      toast.success('Subscriber deleted successfully!');
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Error deleting subscriber');
    }
  };

  const handleAddSubscriber = async (data: any) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: data.email, status: 'Active' }]);

      if (error) {
        console.error('Error adding subscriber:', error);
        toast.error('Error adding subscriber');
        return;
      }

      await loadSubscribers();
      toast.success('Subscriber added successfully!');
      setIsFormOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast.error('Error adding subscriber');
    }
  };

  const handleExportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date,Status\n"
      + subscribers.map(sub => `${sub.email},${new Date(sub.created_at).toLocaleDateString()},${sub.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Subscribers list exported successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="mt-2 text-gray-600">Manage your email subscribers</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleExportSubscribers}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Subscriber
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subscriber</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleAddSubscriber)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      type="email" 
                      {...register('email', { required: true })} 
                      placeholder="subscriber@example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Subscriber</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
                <Mail className="h-8 w-8 text-pink-500 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {subscribers.filter(s => s.status === 'Active').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center ml-auto">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {subscribers.filter(s => {
                      const subDate = new Date(s.created_at);
                      const thisMonth = new Date();
                      return subDate.getMonth() === thisMonth.getMonth() && 
                             subDate.getFullYear() === thisMonth.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center ml-auto">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search subscribers by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="outline">Total: {subscribers.length}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers List</CardTitle>
            <CardDescription>All newsletter subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{subscriber.email}</p>
                      <p className="text-sm text-gray-500">Subscribed on {new Date(subscriber.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {subscriber.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDeleteDialog({ open: true, subscriber })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredSubscribers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No subscribers found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, subscriber: null })}
          onConfirm={() => {
            handleDeleteSubscriber(deleteDialog.subscriber.id);
            setDeleteDialog({ open: false, subscriber: null });
          }}
          title="Delete Subscriber"
          description="Are you sure you want to delete"
          itemName={deleteDialog.subscriber?.email || ''}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;
