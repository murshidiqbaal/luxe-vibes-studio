import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addPortfolioItem, deletePortfolioItem, getPortfolioItems,
  updatePortfolioItem, PortfolioItem, uploadPortfolioImage
} from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Layers, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = ["Weddings", "Corporate", "Private", "Destination"];

// The 4 fallback items visible on the live site (no images — admin must upload)
const DEFAULT_ITEMS = [
  { title: "Royal Garden Wedding",  category: "Weddings",    description: "A breathtaking garden ceremony in Kothamangalam with ocean views.",  image_url: "" },
  { title: "Emerald Gala Night",    category: "Corporate",   description: "Sophisticated corporate gala in Ernakulam with teal uplighting.",      image_url: "" },
  { title: "Intimate Anniversary",  category: "Private",     description: "A warm, candlelit anniversary celebration in Kerala.",                  image_url: "" },
  { title: "Classic White Wedding", category: "Weddings",    description: "Timeless elegance with white florals in Kothamangalam.",               image_url: "" },
];

type EditForm = {
  title: string;
  category: string;
  description: string;
  image_url: string;
  imageFile: File | null;
};

const emptyForm = (): EditForm => ({ title: "", category: "Weddings", description: "", image_url: "", imageFile: null });

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm());
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(true); }, []);

  const fetchItems = async (autoSeed = false) => {
    setLoading(true);
    const data = await getPortfolioItems();
    if (data.length === 0 && autoSeed) {
      try {
        for (const d of DEFAULT_ITEMS) {
          await addPortfolioItem(d);
        }
        const seeded = await getPortfolioItems();
        setItems(seeded);
      } catch {
        setItems([]);
      }
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, category: item.category, description: item.description, image_url: item.image_url, imageFile: null });
    setImagePreview(item.image_url || "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, imageFile: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!editingId && !form.imageFile) { toast.error("Please select an image"); return; }
    setSaving(true);
    try {
      let finalUrl = form.image_url;
      if (form.imageFile) {
        finalUrl = await uploadPortfolioImage(form.imageFile);
      }
      const payload = { title: form.title, category: form.category, description: form.description, image_url: finalUrl };
      if (editingId) {
        await updatePortfolioItem(editingId, payload);
        toast.success("Project updated!");
      } else {
        await addPortfolioItem(payload);
        toast.success("Project added!");
      }
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Remove "${title}" from the portfolio?`)) return;
    try {
      await deletePortfolioItem(id);
      toast.success("Project removed");
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the "Luxury Event Portfolio" section — add, edit, or remove projects.
          </p>
        </div>
        <Button onClick={openAdd} className="h-11 gap-2 text-xs uppercase tracking-widest flex-shrink-0">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {/* Add / Edit slide-in form */}
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
                  {editingId ? "Edit Project" : "Add New Project"}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left — fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Title *</label>
                      <Input
                        placeholder="e.g. Royal Garden Wedding"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                      <select
                        className="w-full p-2.5 rounded-md bg-background border border-border/50 text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                      <Textarea
                        rows={4}
                        className="resize-none"
                        placeholder="A brief description of this event..."
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Right — image */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Project Image {!editingId && <span className="text-destructive">*</span>}
                    </label>
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-secondary/10 border border-border/50 flex items-center justify-center cursor-pointer group"
                      onClick={() => fileRef.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Camera className="w-10 h-10 opacity-30" />
                          <p className="text-xs">Click to choose image</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => { setImagePreview(""); setForm(p => ({ ...p, imageFile: null, image_url: "" })); }}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove image
                      </button>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      Uploaded to the <code className="text-primary">media</code> bucket. Landscape images work best in the masonry grid.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-border/50">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[130px]">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingId ? "Save Changes" : "Add to Portfolio"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Grid */}
      <div>
        <div className="flex items-center gap-2 mb-5 px-1">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg">Published Projects ({items.length})</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative glass border border-border/50 rounded-lg overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-secondary/10">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <Camera className="w-10 h-10 opacity-20" />
                      <span className="text-xs">No image — click Edit to upload</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] text-primary uppercase tracking-widest font-bold bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Info + actions */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-heading text-base truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(item.id, item.title)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-muted-foreground">
              <Camera className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">No projects yet.</p>
              <p className="text-sm mt-1">Click "Add Project" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
