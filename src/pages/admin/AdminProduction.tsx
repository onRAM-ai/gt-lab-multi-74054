
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductionTimeline from '@/components/admin/ProductionTimeline';
import AlertsPanel from '@/components/admin/AlertsPanel';

const AdminProduction = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Production
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Track production timeline and manage alerts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductionTimeline />
          </div>
          <div>
            <AlertsPanel />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProduction;
