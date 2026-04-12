import { useState, useEffect } from "react";
import {
  getServices, addService, updateService, deleteService,
  uploadServiceImage, ServiceItem
} from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2, Plus, Trash2, Pencil, X, Save,
  Heart, Globe, Briefcase, Sparkles, Camera, GripVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_OPTIONS = [
  { key: 'Heart', label: 'Heart', icon: Heart },
  { key: 'Globe', label: 'Globe', icon: Globe },
  { key: 'Briefcase', label: 'Briefcase', icon: Briefcase },
  { key: 'Sparkles', label: 'Sparkles', icon: Sparkles },
];

const ICON_MAP: Record<string, any> = { Heart, Globe, Briefcase, Sparkles };

const DEFAULT_SERVICES = [
  { title: "Luxury Weddings", description: "Exquisite wedding celebrations in Kothamangalam and Ernakulam, crafted with unparalleled attention to detail and elegance.", icon: "Heart", sort_order: 1, image_url: "" },
  { title: "Destination Weddings", description: "Breathtaking destination wedding ceremonies across Kerala and India's most stunning exclusive locations.", icon: "Globe", sort_order: 2, image_url: "" },
  { title: "Corporate Events", description: "Sophisticated corporate events and business gatherings in Ernakulam that leave lasting professional impressions.", icon: "Briefcase", sort_order: 3, image_url: "" },
  { title: "Private Celebrations", description: "Intimate private celebrations and anniversary events designed to create unforgettable personal memories in Kerala.", icon: "Sparkles", sort_order: 4, image_url: "" },
];

type EditForm = {
  title: string;
  description: string;
  icon: string;
  image_url: string;
  imageFile: File | null;
  sort_order: number;
};

const emptyForm = (): EditForm => ({
  title: "",
  description: "",
  icon: "Sparkles",
  image_url: "",
  imageFile: null,
  sort_order: 99,
});

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seedingDefaults, setSeedingDefaults] = useState(false);

  // Edit / Add modal state
  const [editingId, setEditingId] = useState<string | null>(null); // null = adding new
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EditForm>(emptyForm());
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => { fetchServices(true); }, []);

  const fetchServices = async (autoSeed = false) => {
    setLoading(true);
    const data = await getServices();
    if (data.length === 0 && autoSeed) {
      // Table is empty — silently seed the current site defaults so admin can edit them
      try {
        for (const s of DEFAULT_SERVICES) {
          await addService(s);
        }
        const seeded = await getServices();
        setServices(seeded);
      } catch {
        setServices([]);
      }
    } else {
      setServices(data);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm(), sort_order: services.length + 1 });
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description,
      icon: s.icon || "Sparkles",
      image_url: s.image_url || "",
      imageFile: null,
      sort_order: s.sort_order,
    });
    setImagePreview(s.image_url || "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, imageFile: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      let finalImageUrl = form.image_url;
      if (form.imageFile) {
        finalImageUrl = await uploadServiceImage(form.imageFile);
      }

      const payload = {
        title: form.title,
        description: form.description,
        icon: form.icon,
        image_url: finalImageUrl,
        sort_order: form.sort_order,
      };

      if (editingId) {
        await updateService(editingId, payload);
        toast.success("Service updated!");
      } else {
        await addService(payload);
        toast.success("Service added!");
      }
      setShowForm(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Remove "${title}" from services?`)) return;
    try {
      await deleteService(id);
      toast.success("Service removed");
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const seedDefaults = async () => {
    if (!window.confirm("This will add the 4 default services. Continue?")) return;
    setSeedingDefaults(true);
    try {
      for (const s of DEFAULT_SERVICES) {
        await addService(s);
      }
      toast.success("Default services seeded!");
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Seeding failed");
    } finally {
      setSeedingDefaults(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading Services...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage "Premium Event Planning Services" section. Images upload to <code className="text-primary text-xs bg-primary/10 px-1 rounded">services-images</code> bucket.
          </p>
        </div>
        <Button onClick={openAdd} className="h-11 gap-2 text-xs uppercase tracking-widest">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <Card className="border-primary/30 shadow-xl bg-secondary/5">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <CardTitle className="text-lg font-heading">
                  {editingId ? "Edit Service" : "Add New Service"}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title *</label>
                      <Input
                        placeholder="e.g. Luxury Weddings"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description *</label>
                      <Textarea
                        rows={4}
                        className="resize-none"
                        placeholder="Describe this service..."
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Icon</label>
                        <select
                          className="w-full p-2 rounded-md bg-background border border-border/50 text-sm focus:ring-1 focus:ring-primary outline-none"
                          value={form.icon}
                          onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                        >
                          {ICON_OPTIONS.map(o => (
                            <option key={o.key} value={o.key}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort Order</label>
                        <Input
                          type="number"
                          min={1}
                          value={form.sort_order}
                          onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right — image */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Background Image <span className="text-primary">(services-images bucket)</span>
                    </label>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary/10 border border-border/50 flex items-center justify-center">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setImagePreview(""); setForm(p => ({ ...p, imageFile: null, image_url: "" })); }}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Camera className="w-10 h-10 opacity-30" />
                          <p className="text-xs">No background image</p>
                        </div>
                      )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative flex-1">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                        <Button variant="outline" type="button" className="w-full pointer-events-none text-xs uppercase tracking-widest h-10">
                          <Camera className="w-4 h-4 mr-2" /> Choose Image
                        </Button>
                      </div>
                    </label>
                    <p className="text-[10px] text-muted-foreground">
                      This image appears as a subtle background on the service card. Leave blank for icon-only style.
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="border border-border/50 rounded-lg p-4 bg-background/50">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Card Preview</p>
                  <div className="relative h-40 glass rounded-sm overflow-hidden flex flex-col justify-end p-6">
                    {imagePreview && (
                      <img src={imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
                    <div className="relative z-10">
                      {(() => {
                        const IconComp = ICON_MAP[form.icon] || Sparkles;
                        return <IconComp className="w-8 h-8 text-primary mb-2 stroke-1" />;
                      })()}
                      <p className="font-heading text-lg">{form.title || "Service Title"}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{form.description || "Service description..."}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[120px]">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingId ? "Save Changes" : "Add Service"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl text-muted-foreground">
          <Sparkles className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-medium">No services yet.</p>
          <p className="text-sm mt-1">Click "Add Service" or "Seed Defaults" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {services.map((s) => {
              const IconComp = ICON_MAP[s.icon] || Sparkles;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="group relative glass border border-border/50 rounded-lg overflow-hidden"
                >
                  {/* Card bg image */}
                  <div className="relative h-40 overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <IconComp className="w-16 h-16 text-primary/20 stroke-1" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComp className="w-4 h-4 text-primary stroke-1" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-primary uppercase tracking-widest font-semibold block">Order #{s.sort_order}</span>
                          <h3 className="font-heading text-base truncate">{s.title}</h3>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => openEdit(s)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(s.id, s.title)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-3 line-clamp-2">{s.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
