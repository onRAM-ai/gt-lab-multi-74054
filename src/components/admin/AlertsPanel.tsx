
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: string;
  project_id: number | null;
  message: string;
  is_read: boolean;
  priority: string;
  created_at: string;
  projects?: {
    name: string;
    client: string;
  };
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    
    // Setup real-time subscription for new alerts
    const channel = supabase
      .channel('alerts_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'alerts' 
      }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          projects (
            name,
            client
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Error loading alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, is_read: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast.error('Erro ao marcar como lido');
    }
  };

  const dismissAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAlerts(prev => prev.filter(alert => alert.id !== id));
      toast.success('Alerta removido');
    } catch (error) {
      console.error('Error dismissing alert:', error);
      toast.error('Erro ao remover alerta');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline_warning': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'approval_pending': return <Bell className="h-4 w-4" />;
      case 'new_order': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (priority: string, isRead: boolean) => {
    const baseColors = {
      'urgent': 'border-red-200 bg-red-50',
      'high': 'border-orange-200 bg-orange-50',
      'medium': 'border-yellow-200 bg-yellow-50',
      'low': 'border-blue-200 bg-blue-50'
    };
    
    if (isRead) {
      return 'border-gray-200 bg-gray-50';
    }
    
    return baseColors[priority as keyof typeof baseColors] || baseColors.medium;
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAlertType = (type: string) => {
    const types = {
      'deadline_warning': 'Prazo se aproximando',
      'overdue': 'Atrasado',
      'approval_pending': 'Aprovação pendente',
      'new_order': 'Novo pedido'
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) {
    return <div className="flex justify-center p-4">Carregando alertas...</div>;
  }

  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas e Notificações
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Acompanhe prazos, aprovações e novos pedidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all ${getAlertColor(alert.priority, alert.is_read)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 ${alert.is_read ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityBadgeColor(alert.priority)} variant="secondary">
                        {formatAlertType(alert.type)}
                      </Badge>
                      <Badge variant="outline">
                        {alert.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className={`text-sm ${alert.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {alert.message}
                    </p>
                    {alert.projects && (
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.projects.name} - {alert.projects.client}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(alert.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {!alert.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum alerta
            </h3>
            <p className="text-gray-500">
              Você está em dia com tudo!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
