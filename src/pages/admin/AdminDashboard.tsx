import { useState, useEffect } from "react";
import { checkSystemStatus } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  getPortfolioItems, 
  getTestimonials 
} from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MessageSquare, 
  ChevronRight,
  Camera,
  Users,
  Heart,
  Type,
  ImageIcon,
  LayoutGrid,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DatabaseSeeder from "@/components/admin/DatabaseSeeder";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    galleryCount: 0,
    portfolioCount: 0,
    weddingMoments: 4,
    teamMembers: 6,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const status = await checkSystemStatus();
        if (status.database) {
          const projects = await getPortfolioItems();
          setStats(prev => ({
            ...prev,
            portfolioCount: projects.length,
            galleryCount: projects.length // Temporary mapping
          }));
        }
      } catch (error: any) {
        console.error("Dashboard data fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A6741] animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome to your content management system.</p>
        </section>
        <DatabaseSeeder />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard 
          icon={Camera} 
          label="Total Gallery Images" 
          value={stats.galleryCount} 
          sub="Photos across all categories" 
        />
        <StatCard 
          icon={LayoutGrid} 
          label="Recent Works" 
          value={stats.portfolioCount} 
          sub="Projects in the carousel" 
        />
        <StatCard 
          icon={LayoutGrid} 
          label="Wedding Moments" 
          value={stats.weddingMoments} 
          sub="Images in the marquee" 
        />
        <StatCard 
          icon={LayoutGrid} 
          label="Team Members" 
          value={stats.teamMembers} 
          sub="Creative professionals" 
        />
      </div>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionItem 
            icon={Camera} 
            iconColor="bg-blue-50 text-blue-500"
            label="Manage Gallery" 
            desc="Add or remove photos from the main gallery"
            path="/admin/gallery"
          />
          <QuickActionItem 
            icon={LayoutGrid} 
            iconColor="bg-purple-50 text-purple-500"
            label="Recent Works" 
            desc="Update the recent works carousel"
            path="/admin/portfolio"
          />
          <QuickActionItem 
            icon={ImageIcon} 
            iconColor="bg-orange-50 text-orange-500"
            label="Site Images" 
            desc="Update static site images"
            path="/admin/site-images"
          />
          <QuickActionItem 
            icon={Users} 
            iconColor="bg-red-50 text-red-500"
            label="Team Manager" 
            desc="Manage the people behind Sphinx"
            path="/admin/team"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
          </div>
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-xs text-slate-400">{sub}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionItem({ icon: Icon, iconColor, label, desc, path }: any) {
  return (
    <Link to={path} className="group">
      <Card className="border-slate-200 bg-white shadow-sm group-hover:border-[#4A6741]/30 group-hover:shadow-md transition-all h-full">
        <CardContent className="p-6 flex items-start gap-4">
          <div className={`p-3 rounded-xl ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 group-hover:text-[#4A6741] transition-colors">{label}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
