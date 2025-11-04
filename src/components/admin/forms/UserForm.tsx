
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface UserFormProps {
  user?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm = ({ user, onSuccess, onCancel }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'viewer',
      status: user?.status || 'Active',
      password: ''
    }
  });

  const role = watch('role');
  const status = watch('status');
  const password = watch('password');

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(newPassword);
    setValue('password', newPassword);
    toast.success('Password generated successfully!');
  };

  const copyPassword = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        toast.success('Password copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy password');
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
        toast.success('User updated successfully!');
      } else {
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert([{
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status
          }]);

        if (error) throw error;
        
        if (data.password) {
          toast.success(`User created successfully! Password: ${data.password}`, {
            duration: 10000,
          });
        } else {
          toast.success('User created successfully!');
        }
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error saving user');
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input {...register('name', { required: true })} />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input type="email" {...register('email', { required: true })} />
        </div>

        {!user && (
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="Generate or enter password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate Password
                </Button>
                {password && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyPassword}
                  >
                    Copy Password
                  </Button>
                )}
              </div>
              {password && (
                <p className="text-xs text-gray-600">
                  Make sure to save this password! It will be shown once.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(value) => setValue('role', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default UserForm;
