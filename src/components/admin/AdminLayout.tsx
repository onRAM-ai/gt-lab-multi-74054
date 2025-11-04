
import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import InactivityDialog from './InactivityDialog';
import NotificationDropdown from './NotificationDropdown';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FolderOpen, 
  Settings, 
  LogOut,
  Mail,
  Briefcase,
  Globe
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const [showInactivityDialog, setShowInactivityDialog] = useState(false);

  // Set up inactivity timeout - 5 minutes
  const { resetTimer } = useInactivityTimeout({
    timeout: 5 * 60 * 1000, // 5 minutes
    warningTime: 30 * 1000, // 30 seconds warning
    onWarning: () => setShowInactivityDialog(true),
    onTimeout: () => {
      setShowInactivityDialog(false);
      logout();
    }
  });

  const handleStayActive = () => {
    setShowInactivityDialog(false);
    resetTimer();
  };

  const handleLogout = () => {
    setShowInactivityDialog(false);
    logout();
  };

  if (!user) {
    return <Navigate to="/_adminpanel" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/_adminpanel/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/_adminpanel/leads', icon: UserCheck },
    { name: 'Clients', href: '/_adminpanel/clients', icon: Users },
    { name: 'Projects', href: '/_adminpanel/projects', icon: FolderOpen },
    { name: 'Production', href: '/_adminpanel/production', icon: Settings },
    { name: 'Job Applications', href: '/_adminpanel/job-applications', icon: Briefcase },
    { name: 'Website Quotes', href: '/_adminpanel/website-quotes', icon: Globe },
    { name: 'Subscribers', href: '/_adminpanel/subscribers', icon: Mail },
    { name: 'Users', href: '/_adminpanel/users', icon: Users },
    { name: 'Settings', href: '/_adminpanel/settings', icon: Settings },
  ];

  return (
    <>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar navigation={navigation} user={user} logout={logout} currentPath={location.pathname} />
        <main className="flex-1">
          <header className="h-16 bg-white shadow-sm flex items-center px-6 sticky top-0 z-10">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationDropdown />
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      <InactivityDialog
        open={showInactivityDialog}
        onStayActive={handleStayActive}
        onLogout={handleLogout}
        countdown={30}
      />
    </>
  );
};

function AppSidebar({ navigation, user, logout, currentPath }: { 
  navigation: any[], 
  user: any, 
  logout: () => void, 
  currentPath: string 
}) {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/1f03d43f-7d63-4c08-bfc0-0a07dfda23bf.png" 
            alt="Kreative Theory" 
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link 
                key={item.name}
                to={item.href} 
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-pink-50 text-pink-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
