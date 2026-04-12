import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGalleryItems, type GalleryItem } from '@/lib/supabase';
import { X, Maximize2 } from 'lucide-react';

const categories = ['all', 'wedding', 'event', 'destination'];

export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['galleryItems'],
    queryFn: getGalleryItems
  });

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  if (isLoading) return null;

  return (
    <section id="gallery" className="py-32 bg-background relative overflow-hidden grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
        >
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-6">Gallery</p>
            <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
                Captured <span className="text-gradient">Moments</span>
            </h2>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-500 rounded-full border ${
                filter === cat
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                  : 'border-white/10 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.$id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="relative group cursor-pointer break-inside-avoid rounded-xl overflow-hidden shadow-2xl"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-primary text-[10px] tracking-widest uppercase mb-2">{item.category}</p>
                    <h3 className="font-heading text-xl text-white tracking-wide">{item.title}</h3>
                  </div>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
                        <Maximize2 className="w-4 h-4" />
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors" aria-label="Close">
                <X className="w-10 h-10 stroke-1" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full h-full flex flex-col md:flex-row items-center gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 h-full max-h-[70vh] md:max-h-full">
                <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.title} 
                    className="w-full h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
                />
              </div>
              <div className="w-full md:w-80 text-left shrink-0">
                <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">{selectedImage.category}</p>
                <h3 className="font-heading text-3xl md:text-4xl text-white mb-6 tracking-wide leading-tight">
                    {selectedImage.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    {selectedImage.description}
                </p>
                <div className="h-px w-20 bg-primary/30 mb-8" />
                <button className="text-[10px] tracking-[0.3em] uppercase text-white hover:text-primary transition-colors">
                    Back To Moments
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
