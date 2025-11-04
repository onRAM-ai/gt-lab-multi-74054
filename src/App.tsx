
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
import CertificationsPage from "./pages/CertificationsPage";
import PlanEvent from "./pages/PlanEvent";
import Careers from "./pages/Careers";
import JobApplication from "./pages/JobApplication";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminClients from "./pages/admin/AdminClients";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProduction from "./pages/admin/AdminProduction";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobApplications from "./pages/admin/AdminJobApplications";
import InterviewScheduling from "./pages/InterviewScheduling";
import WebsiteQuote from "./pages/WebsiteQuote";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminWebsiteQuotes from "./pages/admin/AdminWebsiteQuotes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  useGoogleAnalytics();
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/certifications" element={<CertificationsPage />} />
      <Route path="/plan-event" element={<PlanEvent language={language} />} />
      <Route path="/careers" element={<Careers language={language} />} />
      <Route path="/job-application" element={<JobApplication language={language} />} />
      <Route path="/quote_website" element={<WebsiteQuote />} />
      <Route path="/_adminpanel" element={<AdminLogin />} />
      <Route path="/_adminpanel/dashboard" element={<AdminDashboard />} />
      <Route path="/_adminpanel/leads" element={<AdminLeads />} />
      <Route path="/_adminpanel/clients" element={<AdminClients />} />
      <Route path="/_adminpanel/projects" element={<AdminProjects />} />
      <Route path="/_adminpanel/production" element={<AdminProduction />} />
      <Route path="/_adminpanel/job-applications" element={<AdminJobApplications />} />
      <Route path="/_adminpanel/subscribers" element={<AdminSubscribers />} />
      <Route path="/_adminpanel/website-quotes" element={<AdminWebsiteQuotes />} />
      <Route path="/_adminpanel/users" element={<AdminUsers />} />
      <Route path="/_adminpanel/settings" element={<AdminSettings />} />
      <Route path="/interview-scheduling/:token" element={<InterviewScheduling />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
