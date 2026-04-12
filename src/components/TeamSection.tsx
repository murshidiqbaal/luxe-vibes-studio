import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getTeamMembers, type TeamMember } from '@/lib/supabase';
import { Instagram, Linkedin, Twitter, Globe, Github } from 'lucide-react';

export default function TeamSection() {
  const { data: team = [], isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: getTeamMembers
  });

  const DEFAULT_TEAM = [
    {
      $id: 'fallback-sreejith',
      name: "Sreejith",
      role: "Founder",
      bio: "As the founder of Luxe Vibe, Sreejith brings over a decade of luxury event management experience. His visionary approach to cinematic weddings ensures every celebration remains timeless.",
      image_url: "",
      social_links: "[]"
    }
  ];

  const displayTeam = team.length > 0 ? team : DEFAULT_TEAM;

  if (isLoading) return null;

  return (
    <section id="team" className="py-32 bg-background relative border-t border-white/5 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-24"
        >
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-6">Our Experts</p>
            <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
                Creative <span className="text-gradient">Team</span>
            </h2>
            <p className="mt-6 text-muted-foreground/80 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed tracking-wide">
                The visionaries and planners behind Kerala's most cinematic weddings and luxury events.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {displayTeam.map((member, i) => (
            <motion.div
              key={member.$id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-8 w-64 h-64">
                {/* Decorative Elements */}
                <div className="absolute inset-0 border border-primary/20 rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
                <div className="absolute inset-2 border border-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-[1500ms]" />
                
                <div className="relative w-full h-full overflow-hidden rounded-full ring-1 ring-white/10 p-2 group-hover:ring-primary/20 transition-all duration-700">
                    <img 
                      src={member.image_url || '/placeholder-user.jpg'} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                    />
                </div>
              </div>

              <h4 className="font-heading text-2xl mb-1 tracking-wide group-hover:text-primary transition-colors duration-500">
                {member.name}
              </h4>
              <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-4 font-bold">
                {member.role}
              </p>
              <p className="text-muted-foreground/80 text-sm font-light leading-relaxed mb-6 px-4">
                {member.bio}
              </p>

              <div className="flex gap-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-700">
                <a href="#" className="p-2 border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
