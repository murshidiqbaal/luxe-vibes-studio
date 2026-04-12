import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import KeyboardShortcuts from "./components/admin/KeyboardShortcuts.tsx";
import HeroManager from "./components/admin/sections/HeroManager";
import PortfolioManager from "./components/admin/sections/PortfolioManager";
import ServicesManager from "./components/admin/sections/ServicesManager";
import TestimonialsManager from "./components/admin/sections/TestimonialsManager";
import SiteImagesManager from "./components/admin/sections/SiteImagesManager";
import GalleryManager from "./components/admin/sections/GalleryManager";
import TeamManager from "./components/admin/sections/TeamManager";
import { AuthProvider } from "./hooks/useAuth.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <KeyboardShortcuts />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/hero" element={
                <div className="max-w-5xl mx-auto"><HeroManager /></div>
              } />
              <Route path="/admin/services" element={
                <div className="max-w-6xl mx-auto"><ServicesManager /></div>
              } />
              <Route path="/admin/portfolio" element={
                <div className="max-w-7xl mx-auto"><PortfolioManager /></div>
              } />
              <Route path="/admin/testimonials" element={
                <div className="max-w-6xl mx-auto"><TestimonialsManager /></div>
              } />
              <Route path="/admin/site-images" element={
                <div className="max-w-6xl mx-auto"><SiteImagesManager /></div>
              } />
              <Route path="/admin/gallery" element={
                <div className="max-w-6xl mx-auto"><GalleryManager /></div>
              } />
              <Route path="/admin/team" element={
                <div className="max-w-6xl mx-auto"><TeamManager /></div>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
