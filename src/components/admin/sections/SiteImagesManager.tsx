import { useState, useEffect } from "react";
import { getContentDocument, updateContentDocument, createContentDocument, uploadMedia } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const STATIC_IMAGE_SLOTS = [
  { id: "hero_section", label: "Hero Background", field: "imageUrl", type: "document" },
  { id: "about_section", label: "About Section Image", field: "imageUrl", type: "document" },
  { id: "static_images", label: "Gallery Preview 1", field: "gallery_1", type: "json" },
  { id: "static_images", label: "Gallery Preview 2", field: "gallery_2", type: "json" },
];

export default function SiteImagesManager() {
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const hero = await getContentDocument('hero_section').catch(() => ({}));
      const about = await getContentDocument('about_section').catch(() => ({}));
      const statics = await getContentDocument('static_images').catch(() => ({ urls: "{}" }));
      
      const staticUrls = JSON.parse(statics.urls || "{}");
      
      setImages({
        hero_section: hero.imageUrl || "",
        about_section: about.imageUrl || "",
        ...staticUrls
      });
    } catch (error) {
       console.log("Error fetching some images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (slot: any, file: File) => {
    setUploadingId(slot.label);
    try {
      const newUrl = await uploadMedia(file);

      if (slot.type === "document") {
        try {
          await updateContentDocument(slot.id, { [slot.field]: newUrl });
        } catch {
          await createContentDocument(slot.id, { [slot.field]: newUrl });
        }
      } else {
        const statics = await getContentDocument('static_images').catch(() => null);
        const currentUrls = statics ? JSON.parse(statics.urls || "{}") : {};
        const updatedUrls = { ...currentUrls, [slot.field]: newUrl };
        
        if (statics) {
          await updateContentDocument('static_images', { urls: JSON.stringify(updatedUrls) });
        } else {
          await createContentDocument('static_images', { urls: JSON.stringify(updatedUrls) });
        }
      }

      setImages(prev => ({ ...prev, [slot.type === "document" ? slot.id : slot.field]: newUrl }));
      toast.success(`${slot.label} updated!`);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading Site Images...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Images</h1>
        <p className="text-slate-500">Manage static images across the site.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STATIC_IMAGE_SLOTS.map((slot) => (
          <ImageCard 
            key={slot.label}
            slot={slot}
            currentUrl={images[slot.type === "document" ? slot.id : slot.field]}
            isUploading={uploadingId === slot.label}
            onUpload={(file: File) => handleImageUpload(slot, file)}
          />
        ))}
      </div>
    </div>
  );
}

function ImageCard({ slot, currentUrl, isUploading, onUpload }: any) {
  return (
    <Card className="border-border/50 glass shadow-sm overflow-hidden flex flex-col group">
      <CardHeader className="p-5 border-b border-border/50">
        <CardTitle className="text-base font-bold text-slate-700">{slot.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative aspect-video bg-slate-100/50 overflow-hidden">
          {currentUrl ? (
            <img 
              src={currentUrl} 
              alt={slot.label} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <ImageIcon className="w-10 h-10 stroke-1" />
              <span className="text-xs font-medium uppercase tracking-widest">No Image Set</span>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        <div className="p-5 mt-auto">
          <div className="relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              disabled={isUploading}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onUpload(e.target.files[0]);
                }
              }}
            />
            <Button 
              variant="outline" 
              className="w-full py-6 border-border/50 text-slate-600 hover:text-primary bg-background/50 hover:bg-background transition-all font-semibold uppercase tracking-widest text-[10px] gap-2"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4" />
              Replace Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
