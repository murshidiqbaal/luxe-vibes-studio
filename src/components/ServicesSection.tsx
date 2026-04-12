import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/lib/supabase';
import { Heart, Globe, Briefcase, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';

const ICON_MAP: Record<string, any> = { Heart, Globe, Briefcase, Sparkles };

const FALLBACK_SERVICES = [
  { id: 'f1', title: 'Luxury Weddings',      description: 'Exquisite wedding celebrations in Kothamangalam and Ernakulam, crafted with unparalleled attention to detail and elegance.', icon: 'Heart',     image_url: '', sort_order: 1, created_at: '' },
  { id: 'f2', title: 'Destination Weddings', description: "Breathtaking destination wedding ceremonies across Kerala and India's most stunning exclusive locations.",                  icon: 'Globe',     image_url: '', sort_order: 2, created_at: '' },
  { id: 'f3', title: 'Corporate Events',     description: 'Sophisticated corporate events and business gatherings in Ernakulam that leave lasting professional impressions.',          icon: 'Briefcase', image_url: '', sort_order: 3, created_at: '' },
  { id: 'f4', title: 'Private Celebrations', description: 'Intimate private celebrations and anniversary events designed to create unforgettable personal memories in Kerala.',       icon: 'Sparkles',  image_url: '', sort_order: 4, created_at: '' },
];

export default function ServicesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: 'trimSnaps' },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const data = await getServices();
        return data.length > 0 ? data : null;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const activeServices = services ?? FALLBACK_SERVICES;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo  = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section id="services" className="py-32 grain-overlay overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-6">What We Do</p>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Premium Event Planning <span className="text-gradient">Services</span>
          </h2>
        </motion.div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Prev arrow */}
          <button
            onClick={scrollPrev}
            aria-label="Previous service"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 flex items-center justify-center w-11 h-11 rounded-full border border-border/60 bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next arrow */}
          <button
            onClick={scrollNext}
            aria-label="Next service"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 flex items-center justify-center w-11 h-11 rounded-full border border-border/60 bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Embla viewport */}
          <div className="overflow-hidden mx-6" ref={emblaRef}>
            <div className="flex gap-6">
              {activeServices.map((s, i) => {
                const IconComp = ICON_MAP[s.icon] || Sparkles;
                const isActive = i === selectedIndex;
                return (
                  <div
                    key={s.id}
                    style={{ flex: '0 0 min(85%, 420px)' }}
                    className="relative"
                  >
                    <motion.article
                      animate={{
                        scale: isActive ? 1 : 0.92,
                        opacity: isActive ? 1 : 0.45,
                      }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="relative min-h-[380px] p-10 glass border border-border/50 hover:border-primary/50 rounded-sm overflow-hidden flex flex-col justify-end cursor-pointer group transition-colors duration-500"
                      onClick={() => scrollTo(i)}
                    >
                      {/* Background image */}
                      {s.image_url && (
                        <img
                          src={s.image_url}
                          alt={s.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[1500ms] ease-out z-[-2]"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-[-1]" />

                      {/* Active glow overlay */}
                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent z-0 pointer-events-none"
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <motion.div
                          animate={{ y: isActive ? 0 : 8, opacity: isActive ? 1 : 0.6 }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComp
                            className="stroke-[1px] w-12 h-12 text-primary mb-6 transition-all duration-500"
                            aria-hidden="true"
                          />
                          <h3 className="font-heading text-3xl mb-4 tracking-wide text-foreground">{s.title}</h3>
                          <p className="text-muted-foreground/90 font-light text-sm leading-loose">{s.description}</p>
                        </motion.div>
                      </div>

                      {/* Active indicator line */}
                      <motion.div
                        animate={{ scaleX: isActive ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
                      />
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2.5 mt-10">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative flex items-center justify-center w-8 h-4"
              >
                <motion.span
                  animate={{
                    width: i === selectedIndex ? 28 : 8,
                    backgroundColor: i === selectedIndex ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-[3px] rounded-full"
                  style={{ width: i === selectedIndex ? 28 : 8 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
