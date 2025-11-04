
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertTriangle, User, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductionItem {
  id: string;
  project_id: number;
  status: string;
  notes: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  project: {
    id: number;
    name: string;
    client: string;
    assigned_to: string;
    value: string;
  };
}

const ProductionTimeline = () => {
  const [items, setItems] = useState<ProductionItem[]>([]);
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
    fetchProductionItems();
  }, []);

  const fetchProductionItems = async () => {
    try {
      const { data, error } = await supabase
        .from('production_tracking')
        .select(`
          *,
          project:projects (
            id,
            name,
            client,
            assigned_to,
            value
          )
        `)
        .order('estimated_delivery', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching production items:', error);
      toast.error('Error loading production timeline');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('production_tracking')
        .update({ 
          status: newStatus,
          actual_delivery: newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status updated successfully!');
      fetchProductionItems();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'design': return 'bg-blue-100 text-blue-800';
      case 'client_approval': return 'bg-yellow-100 text-yellow-800';
      case 'production': return 'bg-orange-100 text-orange-800';
      case 'quality_check': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'design': return <Package className="h-4 w-4" />;
      case 'client_approval': return <Clock className="h-4 w-4" />;
      case 'production': return <Package className="h-4 w-4" />;
      case 'quality_check': return <AlertTriangle className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const statusOptions = [
    'design',
    'client_approval', 
    'production',
    'quality_check',
    'ready',
    'delivered'
  ];

  const formatStatusName = (status: string) => {
    const names = {
      'design': 'Design',
      'client_approval': 'Client Approval',
      'production': 'Production',
      'quality_check': 'Quality Check',
      'ready': 'Ready',
      'delivered': 'Delivered'
    };
    return names[status as keyof typeof names] || status;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading timeline...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Production Timeline</h2>
        <Button onClick={fetchProductionItems} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Badge className={getStatusColor(item.status)}>
                      {formatStatusName(item.status)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{safeRender(item.project.name)}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{safeRender(item.project.client)}</p>
                  <p className="font-semibold text-green-600">{safeRender(item.project.value)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{safeRender(item.project.assigned_to) || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Delivery: {item.estimated_delivery ? new Date(item.estimated_delivery).toLocaleDateString('en-US') : 'Not defined'}
                  </span>
                </div>
                {item.actual_delivery && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      Delivered: {new Date(item.actual_delivery).toLocaleDateString('en-US')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    variant={item.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateStatus(item.id, status)}
                    disabled={item.status === status}
                  >
                    {formatStatusName(status)}
                  </Button>
                ))}
              </div>

              {item.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items in production
            </h3>
            <p className="text-gray-500">
              New orders from JotForm will appear here automatically.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionTimeline;
