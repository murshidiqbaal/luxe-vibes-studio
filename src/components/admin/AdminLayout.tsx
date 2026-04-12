import logo from '@/assets/luxevibelogo.png';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Sparkles,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
  { icon: ImageIcon, label: "Hero Visuals", path: "/admin/hero" },
  { icon: Sparkles, label: "Services", path: "/admin/services" },
  { icon: Briefcase, label: "Portfolio", path: "/admin/portfolio" },
  { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials" },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium uppercase tracking-[0.2em] animate-pulse">Initializing Luxe Console</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#0A0A0A] fixed inset-y-0 z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Luxe Vibe Logo" className="w-10 h-10 transition-transform group-hover:scale-110" />
            <div>
              <span className="block text-lg font-heading font-bold tracking-tight">LUXE VIBE</span>
              <span className="block text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Console v2.0</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-lg transition-all group ${isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-white hover:bg-destructive/10 hover:text-destructive transition-all"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Terminate Session
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 h-20 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-muted-foreground">
              {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active System</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-10 flex-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#0A0A0A] border-r border-white/5 z-[70] lg:hidden p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <img src={logo} alt="Logo" className="w-10 h-10" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${location.pathname === item.path
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:bg-white/5"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <Button
                variant="destructive"
                className="w-full mt-auto"
                onClick={logout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

