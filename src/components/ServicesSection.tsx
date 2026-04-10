import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Heart, Globe, Briefcase, Sparkles, Loader2 } from 'lucide-react';

const serviceIcons = [Heart, Globe, Briefcase, Sparkles];

const fallbackServices = [
  { title: 'Luxury Weddings', desc: 'Exquisite wedding celebrations in Kothamangalam and Ernakulam, crafted with unparalleled attention to detail and elegance.', imageUrl: '' },
  { title: 'Destination Weddings', desc: 'Breathtaking destination wedding ceremonies across Kerala and India\'s most stunning exclusive locations.', imageUrl: '' },
  { title: 'Corporate Events', desc: 'Sophisticated corporate events and business gatherings in Ernakulam that leave lasting professional impressions.', imageUrl: '' },
  { title: 'Private Celebrations', desc: 'Intimate private celebrations and anniversary events designed to create unforgettable personal memories in Kerala.', imageUrl: '' },
];

export default function ServicesSection() {
  const { data: dbServices, isLoading } = useQuery({
    queryKey: ['servicesSection'],
    queryFn: async () => {
      try {
        const doc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionContentId,
          'services_section'
        );
        if (doc.servicesData) {
          return JSON.parse(doc.servicesData);
        }
        return null;
      } catch (error) {
        return null; // Document likely doesn't exist yet
      }
    }
  });

  const activeServices = dbServices && Array.isArray(dbServices) && dbServices.length === 4 ? dbServices : fallbackServices;



  return (
    <section id="services" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-6">What We Do</p>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Premium Event Planning <span className="text-gradient">Services</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeServices.map((s: any, i: number) => {
            const Icon = serviceIcons[i] || Sparkles;
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full min-h-[320px] p-10 glass hover:-translate-y-2 hover:brand-glow hover:border-primary/50 transition-all duration-700 cursor-pointer overflow-hidden rounded-sm flex flex-col justify-end"
              >
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-[1500ms] ease-out z-[-2]"
                  />
                )}
                {/* Image darkening gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-[-1]" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                
                <div className="relative z-10 mt-auto">
                  <Icon className="stroke-[1px] w-10 h-10 text-primary mb-6 group-hover:scale-110 group-hover:text-primary transition-all duration-500" aria-hidden="true" />
                  <h3 className="font-heading text-2xl mb-4 tracking-wide text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground/90 font-light text-sm leading-loose">{s.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
