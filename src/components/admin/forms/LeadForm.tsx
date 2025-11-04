
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LeadFormProps {
  lead?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      company: lead?.company || '',
      message: lead?.message || '',
      source: lead?.source || 'Website',
      status: lead?.status || 'New',
      notes: lead?.notes || ''
    }
  });

  const status = watch('status');
  const source = watch('source');

  const onSubmit = async (data: any) => {
    try {
      if (lead) {
        const { error } = await supabase
          .from('leads')
          .update(data)
          .eq('id', lead.id);
        
        if (error) throw error;
        toast.success('Lead updated successfully!');
      } else {
        const { error } = await supabase
          .from('leads')
          .insert([data]);
        
        if (error) throw error;
        toast.success('Lead created successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Error saving lead');
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{lead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input {...register('name', { required: true })} />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input type="email" {...register('email', { required: true })} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input {...register('phone')} />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input {...register('company')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Source</Label>
            <Select value={source} onValueChange={(value) => setValue('source', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea {...register('message', { required: true })} rows={3} />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea {...register('notes')} rows={2} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default LeadForm;
