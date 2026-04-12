import { useState, useEffect } from "react";
import { getGalleryItems, addGalleryItem, deleteGalleryItem, uploadMedia } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryManager() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: "",
    category: "wedding" as any,
    description: "",
    file: null as File | null
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const docs = await getGalleryItems();
      setImages(docs);
    } catch (error) {
      console.log("No gallery collection found");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!newItem.file || !newItem.title) {
        toast.error("Please provide a title and image");
        return;
    }
    
    setUploading(true);
    try {
      const imageUrl = await uploadMedia(newItem.file);

      await addGalleryItem({ 
          title: newItem.title,
          category: newItem.category,
          description: newItem.description,
          image_url: imageUrl
      });

      toast.success("Image added to gallery!");
      setIsAdding(false);
      setNewItem({ title: "", category: "wedding", description: "", file: null });
      fetchGallery();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm("Remove this image from gallery?")) return;
    try {
      await deleteGalleryItem(docId);
      toast.success("Image removed");
      fetchGallery();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gallery Manager</h1>
          <p className="text-slate-500">Manage the main showcase images on the website.</p>
        </section>
        
        <Button 
            onClick={() => setIsAdding(true)} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold uppercase tracking-widest text-[10px] h-12"
        >
            <Plus className="w-4 h-4" />
            Add To Gallery
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="glass border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Add New Gallery Item</CardTitle>
                    <CardDescription>Upload an image and provide its details.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
                            <Input 
                                placeholder="E.g. Royal Wedding in Kothamangalam" 
                                value={newItem.title}
                                onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                            <Select 
                                value={newItem.category}
                                onValueChange={val => setNewItem(prev => ({ ...prev, category: val as any }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wedding">Wedding</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="destination">Destination</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                        <Textarea 
                            placeholder="Brief story about this moment..." 
                            className="h-[105px]"
                            value={newItem.description}
                            onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Image File</label>
                    <div className="flex items-center gap-4">
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setNewItem(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                        />
                        <Button 
                            onClick={handleUpload} 
                            disabled={uploading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                        >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Upload"}
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {images.map((img) => (
            <motion.div
              key={img.$id || img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative aspect-square bg-white border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all glass"
            >
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                 <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[8px] font-bold uppercase tracking-tighter text-primary">
                    {img.category}
                 </span>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <h4 className="text-white text-xs font-bold mb-1">{img.title}</h4>
                <p className="text-white/60 text-[10px] line-clamp-2 mb-4">{img.description}</p>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 text-white"
                  onClick={() => handleDelete(img.$id || img.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {images.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-slate-50 glass text-slate-400">
            <Camera className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">No images in gallery yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
