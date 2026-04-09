import { useState, useEffect } from "react";
import { appwriteConfig, databases, checkSystemStatus } from "@/lib/appwrite";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  getPortfolioItems, 
  getTestimonials 
} from "@/lib/appwrite";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MessageSquare, 
  Eye, 
  ArrowUpRight,
  Sparkles,
  Camera,
  Calendar,
  Clock,
  AlertTriangle,
  Server,
  Terminal,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [stats, setStats] = useState({
    portfolioCount: 0,
    testimonialCount: 0,
    servicesLive: 0,
    lastUpdate: new Date().toLocaleDateString()
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const status = await checkSystemStatus();
        setConfigStatus(status);

        if (status.database) {
          const projects = await getPortfolioItems();
          const reviews = await getTestimonials();
          
          let servicesCount = 0;
          try {
            const doc = await databases.getDocument(
              appwriteConfig.databaseId, 
              appwriteConfig.collectionContentId, 
              "services_section"
            );
            if (doc.servicesData) {
              servicesCount = JSON.parse(doc.servicesData).length;
            }
          } catch (e) {
            console.log("Services not initialized");
          }

          setStats({
            portfolioCount: projects.length,
            testimonialCount: reviews.length,
            servicesLive: servicesCount,
            lastUpdate: new Date().toLocaleDateString()
          });
        }
      } catch (error: any) {
        console.error("Dashboard data fetch failed:", error);
        toast.error("Cloud connection issue detected");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Luxe Engine</p>
      </div>
    );
  }

  // If database is completely missing, show the setup assistant
  if (configStatus && !configStatus.database) {
    return <SetupAssistant status={configStatus} />;
  }

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-heading mb-2">Welcome Back,</h1>
            <p className="text-xl text-primary font-heading lowercase tracking-tight">
              {user?.email?.split('@')[0]}
            </p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">{stats.lastUpdate}</span>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
          icon={Briefcase} 
          label="Portfolio Projects" 
          value={stats.portfolioCount} 
          sub="Live in gallery" 
          color="text-blue-500"
          link="/admin/portfolio"
        />
        <StatCard 
          icon={MessageSquare} 
          label="Client Reviews" 
          value={stats.testimonialCount} 
          sub="Verified testimonials" 
          color="text-emerald-500"
          link="/admin/testimonials"
        />
        <StatCard 
          icon={Sparkles} 
          label="Active Services" 
          value={stats.servicesLive} 
          sub="Public offerings" 
          color="text-primary"
          link="/admin/services"
        />
        <StatCard 
          icon={Eye} 
          label="System Status" 
          value={configStatus?.database ? "Online" : "Partial"} 
          sub={configStatus?.database ? "Full Sync" : "Sync Issues"} 
          color="text-purple-500"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Quick Launchpad
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <QuickActionLink icon={Camera} label="Update Hero" path="/admin/hero" desc="Change main landing visual" />
            <QuickActionLink icon={Briefcase} label="New Project" path="/admin/portfolio" desc="Add work to your gallery" />
            <QuickActionLink icon={Calendar} label="Review Feedback" path="/admin/testimonials" desc="Moderate client reviews" />
          </div>
        </div>

        {/* Brand Health Card */}
        <div className="lg:col-span-2">
           <Card className="h-full glass border-white/5 bg-gradient-to-br from-[#0A0A0A] to-black overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-32 h-32 text-primary" />
             </div>
             <CardHeader>
               <CardTitle className="text-2xl font-heading">Digital Presence</CardTitle>
               <CardDescription>Your brand identity is synchronized across all cinematic modules.</CardDescription>
             </CardHeader>
             <CardContent>
               {!configStatus?.portfolio || !configStatus?.testimonials || !configStatus?.content ? (
                 <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                   <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                   <div>
                     <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1">Partial Sync Warning</p>
                     <p className="text-sm text-muted-foreground italic">Some content collections are missing in Appwrite. Click 'Overview' to see the setup guide.</p>
                   </div>
                 </div>
               ) : null}

               <div className="space-y-6 mt-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary italic font-heading">L</div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest">Brand Name</p>
                        <p className="text-muted-foreground">Luxe Vibe Studio</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/" target="_blank"><ArrowUpRight className="w-4 h-4" /></Link>
                    </Button>
                  </div>

                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Startup Optimized</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Experience level counters have been removed to highlight your fresh, bespoke approach to luxury wedding planning.
                    </p>
                  </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function SetupAssistant({ status }: { status: any }) {
  const steps = [
    { name: "Database", id: appwriteConfig.databaseId, status: status.database },
    { name: "Portfolio Collection", id: "portfolio", status: status.portfolio },
    { name: "Testimonials Collection", id: "testimonials", status: status.testimonials },
    { name: "General Content Collection", id: appwriteConfig.collectionContentId, status: status.content },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <Server className="w-16 h-16 text-primary mx-auto animate-pulse" />
        <h1 className="text-4xl font-heading">Cloud Setup Required</h1>
        <p className="text-muted-foreground max-w-lg mx-auto italic">
          Your premium dashboard is ready, but your Appwrite cloud database needs the following architecture to synchronize.
        </p>
      </div>

      <div className="grid gap-4">
        {steps.map((step) => (
          <div key={step.name} className="flex items-center justify-between p-6 glass border-white/5 rounded-2xl">
            <div className="flex items-center gap-6">
              {step.status ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-destructive" />}
              <div>
                <p className="font-heading text-lg">{step.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Terminal className="w-3 h-3 text-muted-foreground" />
                  <code className="text-xs bg-white/10 px-2 py-0.5 rounded text-primary">{step.id}</code>
                </div>
              </div>
            </div>
            {!step.status && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-destructive animate-pulse">Action Required</span>
            )}
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-secondary/5 border border-white/5 space-y-4">
        <h3 className="font-heading text-xl flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Command Central
        </h3>
        <p className="text-sm text-muted-foreground">
          Go to your <a href="https://cloud.appwrite.io" target="_blank" className="text-primary underline">Appwrite Console</a> and create a database named <code className="text-primary italic font-bold">{appwriteConfig.databaseId}</code>, then add the collections listed above.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full h-12 shadow-lg shadow-primary/20">
          Sync System Now
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, link }: any) {
  const content = (
    <Card className="glass border-white/5 bg-[#0A0A0A] hover:border-primary/30 transition-all group cursor-default h-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:bg-primary/20 transition-colors`}>
            <Icon className="w-6 h-6" />
          </div>
          {link && <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        <h4 className="text-3xl font-heading mb-1">{value}</h4>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{label}</p>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "70%" }}
             transition={{ duration: 1, delay: 0.5 }}
             className="h-full bg-primary"
           />
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground uppercase tracking-widest">{sub}</p>
      </CardContent>
    </Card>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}

function QuickActionLink({ icon: Icon, label, path, desc }: any) {
  return (
    <Link to={path} className="group">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all">
        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
    </Link>
  );
}


