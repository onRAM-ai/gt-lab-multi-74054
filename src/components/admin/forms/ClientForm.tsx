
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ClientFormProps {
  client?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSuccess, onCancel }: ClientFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: client?.name || '',
      company: client?.company || '',
      email: client?.email || '',
      phone: client?.phone || '',
      website: client?.website || '',
      address: client?.address || '',
      industry: client?.industry || '',
      itin: client?.itin || '',
      status: client?.status || 'Active'
    }
  });

  const status = watch('status');

  const onSubmit = async (data: any) => {
    try {
      if (client) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', client.id);

        if (error) throw error;
        toast.success('Client updated successfully!');
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([data]);

        if (error) throw error;
        toast.success('Client created successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Error saving client');
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Client Name *</Label>
            <Input {...register('name', { required: true })} />
          </div>
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input {...register('company', { required: true })} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input type="email" {...register('email', { required: true })} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input {...register('phone')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input {...register('website')} />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input {...register('industry')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input {...register('address')} />
          </div>
          <div>
            <Label htmlFor="itin">ITIN</Label>
            <Input {...register('itin')} />
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setValue('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {client ? 'Update Client' : 'Create Client'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ClientForm;
