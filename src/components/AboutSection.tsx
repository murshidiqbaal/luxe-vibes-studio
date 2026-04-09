import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import aboutImg from '@/assets/about.jpg';



export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <div ref={ref} className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="overflow-hidden">
              <img
                src={aboutImg}
                alt="Luxevibes luxury wedding decoration in Ernakulam, Kerala"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full object-cover aspect-[4/5]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary/30" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Our Story</p>
            <h2 className="font-heading text-3xl md:text-5xl leading-tight mb-6">
              Best Wedding Planners in{' '}
              <span className="text-gradient">Kothamangalam & Ernakulam</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Luxe Vibe, we are the emerging leaders in luxury wedding planning in Kothamangalam and Ernakulam.
              With a fresh perspective and a passion for cinematic perfection across Kerala, we transform your vision
              into breathtaking celebrations that leave lasting impressions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10">
              From intimate gatherings in Ernakulam to grand destination weddings across Kerala,
              our team of dedicated professionals ensures every detail is meticulously curated
              to reflect your unique story and style.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="font-heading text-2xl md:text-3xl text-primary uppercase tracking-widest">Bespoke</div>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-muted-foreground">Tailored Details</p>
              </div>
              <div className="text-center md:text-left">
                <div className="font-heading text-2xl md:text-3xl text-primary uppercase tracking-widest">Premium</div>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-muted-foreground">Top-Tier Quality</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
