import { useState, useEffect } from "react";
import { checkSystemStatus } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getPortfolioItems 
} from "@/lib/supabase";
import { 
  Camera,
  Users,
  ImageIcon,
  LayoutGrid,
  Loader2,
  Quote
} from "lucide-react";
import { Link } from "react-router-dom";
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
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome to your content management system.</p>
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
          icon={Users} 
          label="Team Members" 
          value={stats.teamMembers} 
          sub="Creative professionals" 
        />
      </div>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold tracking-tight font-heading text-foreground border-b border-border/50 pb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionItem 
            icon={LayoutGrid} 
            label="Portfolio Manager" 
            desc="Update the recent works portfolio grid"
            path="/admin/portfolio"
          />
          <QuickActionItem 
            icon={Quote} 
            label="Testimonials" 
            desc="Add or edit client reviews"
            path="/admin/testimonials"
          />
          <QuickActionItem 
            icon={Camera} 
            label="Manage Gallery" 
            desc="Add or remove photos from the main gallery"
            path="/admin/gallery"
          />
          <QuickActionItem 
            icon={ImageIcon} 
            label="Site Images" 
            desc="Update static site images and heroes"
            path="/admin/site-images"
          />
          <QuickActionItem 
            icon={Users} 
            label="Team Manager" 
            desc="Manage the people behind Luxe Vibe"
            path="/admin/team"
          />
          <QuickActionItem 
            icon={LayoutGrid} 
            label="Services Manager" 
            desc="Modify the services available on homepage"
            path="/admin/services"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <Card className="glass border-border/50 bg-secondary/5 shadow-sm hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{label}</p>
            <h4 className="text-3xl font-bold text-foreground font-heading">{value}</h4>
          </div>
          <div className="p-2 bg-primary/10 rounded-md">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionItem({ icon: Icon, label, desc, path }: any) {
  return (
    <Link to={path} className="group flex">
      <Card className="glass w-full border-border/50 bg-secondary/5 shadow-sm group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all h-full">
        <CardContent className="p-6 flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-foreground font-heading group-hover:text-primary transition-colors tracking-wide">{label}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
