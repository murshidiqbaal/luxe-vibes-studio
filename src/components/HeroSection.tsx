import heroImg from '@/assets/hero-wedding.jpg';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Loader2 } from 'lucide-react';

export default function HeroSection() {
  const { data: heroData, isLoading } = useQuery({
    queryKey: ['heroSection'],
    queryFn: async () => {
      try {
        const doc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionContentId,
          'hero_section'
        );
        return doc;
      } catch (error) {
        // Return null if document doesn't exist yet
        return null;
      }
    }
  });



  // Fallbacks if data doesn't exist
  const title = heroData?.title || "Crafting Unforgettable\nLuxury Experiences";
  const subtitle = heroData?.subtitle || "Bespoke weddings & premium events tailored to perfection";
  const topText = "Premium Wedding & Event Planners";
  const bgImage = heroData?.imageUrl || heroImg;

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden grain-overlay">
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0"
      >
        <img
          src={bgImage}
          alt="Luxury wedding venue setup in Kothamangalam by Luxevibes"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/40 to-background/95 z-[2]" />

      <div className="relative z-[3] flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-primary text-[10px] tracking-[0.5em] uppercase mb-8"
        >
          {topText}
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl max-w-5xl leading-tight whitespace-pre-wrap tracking-wide"
          >
            {title}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
          className="mt-8 text-muted-foreground/80 font-light max-w-xl text-sm md:text-lg tracking-wide leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap gap-6 justify-center"
        >
          <a
            href="#contact"
            className="px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-500"
          >
            Book a Consultation
          </a>
          <a
            href="#portfolio"
            className="px-10 py-4 border border-foreground/20 text-foreground text-xs tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-all duration-500"
          >
            View Portfolio
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2"
      >
        <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent animate-scroll-hint" />
      </motion.div>
    </section>
  );
}
