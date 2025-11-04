
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Mail, Bell, Key, Palette } from 'lucide-react';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure system preferences and integrations</p>
        </div>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>
              Configure email templates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Auto-response Template</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
                defaultValue="Thank you for contacting Kreative Theory! We've received your inquiry and will get back to you within 24 hours."
              />
            </div>
            <Button>Save Email Settings</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Lead Notifications</p>
                <p className="text-sm text-gray-600">Receive email when new leads are submitted</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Updates</p>
                <p className="text-sm text-gray-600">Notifications for project status changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Client Activity</p>
                <p className="text-sm text-gray-600">Updates when clients upload files or make requests</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* API Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Integrations
            </CardTitle>
            <CardDescription>
              Configure external service integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Monday.com API Key</label>
              <Input type="password" placeholder="Enter Monday.com API key" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SAGE Integration</label>
              <Input type="password" placeholder="Enter SAGE API credentials" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CommonSKU API Key</label>
              <Input type="password" placeholder="Enter CommonSKU API key" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">QuickBooks Integration</label>
              <Input type="password" placeholder="Enter QuickBooks API credentials" />
            </div>
            <Button>Save API Settings</Button>
          </CardContent>
        </Card>

        {/* Branding Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding
            </CardTitle>
            <CardDescription>
              Customize the admin panel appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Logo</label>
              <Button variant="outline">Upload Logo</Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer border-2 border-gray-300"></div>
                <div className="w-8 h-8 bg-purple-500 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-green-500 rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-orange-500 rounded cursor-pointer"></div>
              </div>
            </div>
            <Button>Save Branding</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
