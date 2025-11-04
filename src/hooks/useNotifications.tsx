
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: 'lead' | 'project' | 'alert' | 'jotform';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new leads
    const leadsChannel = supabase
      .channel('leads-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          const newLead = payload.new;
          const notification: Notification = {
            id: `lead-${newLead.id}`,
            type: 'lead',
            title: 'New Lead',
            message: `${newLead.name} from ${newLead.company || 'Unknown Company'}`,
            isRead: false,
            createdAt: newLead.created_at,
            data: newLead
          };
          
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch recent leads as notifications
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'New')
        .order('created_at', { ascending: false })
        .limit(10);

      if (leads) {
        const leadNotifications: Notification[] = leads.map(lead => ({
          id: `lead-${lead.id}`,
          type: 'lead',
          title: 'New Lead',
          message: `${lead.name} from ${lead.company || 'Unknown Company'}`,
          isRead: false,
          createdAt: lead.created_at,
          data: lead
        }));

        setNotifications(leadNotifications);
        setUnreadCount(leadNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const addJotFormNotification = (submission: any) => {
    const notification: Notification = {
      id: `jotform-${submission.id}`,
      type: 'jotform',
      title: 'New JotForm Submission',
      message: `${submission.name} - Business Card Order`,
      isRead: false,
      createdAt: new Date().toISOString(),
      data: submission
    };
    
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
    addJotFormNotification
  };
};
