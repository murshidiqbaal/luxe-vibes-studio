import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getContentDocument } from '@/lib/supabase';
import portrait1 from '@/assets/about.jpg'; // Using existing assets as fallbacks

export default function WeddingSection() {
  const { data: weddingData } = useQuery({
    queryKey: ['weddingSection'],
    queryFn: async () => {
      try {
        const doc = await getContentDocument('wedding_section');
        if (doc.data) {
          return JSON.parse(doc.data);
        }
        return null;
      } catch (error) {
        return null;
      }
    }
  });

  const marqueeText = weddingData?.marqueeText || "WE'RE GETTING MARRIED • SAVE THE DATE • LOVE IS IN THE AIR •";
  const title = weddingData?.momentTitle || "Wedding Moments";
  const subtitle = weddingData?.momentSubtitle || "Beautiful memories etched in time.";

  return (
    <section className="py-24 bg-white overflow-hidden">
      {/* Cinematic Marquee */}
      <div className="relative py-12 border-y border-slate-100 mb-20 bg-slate-50/30">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-6xl md:text-8xl font-heading text-slate-900/5 uppercase tracking-tighter mx-8">
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
             <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Cinematic</p>
             <h2 className="font-heading text-4xl md:text-6xl text-slate-900 tracking-tight">
               {title}
             </h2>
             <p className="mt-6 text-slate-500 font-light leading-relaxed">
               {subtitle}
             </p>
          </div>
          <div className="h-px bg-slate-100 flex-1 hidden md:block mb-8 mx-12" />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-10 py-4 bg-slate-900 text-white text-[10px] tracking-[0.2em] uppercase font-bold rounded-sm"
          >
            Explore Gallery
          </motion.button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
          <div className="md:col-span-8 overflow-hidden rounded-xl bg-slate-100 group">
             <img src={portrait1} alt="Wedding Highlight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
             <div className="overflow-hidden rounded-xl bg-slate-100 group">
                <img src={portrait1} alt="Bride Detail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
             </div>
             <div className="overflow-hidden rounded-xl bg-slate-100 group">
                <img src={portrait1} alt="Ceremony" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
