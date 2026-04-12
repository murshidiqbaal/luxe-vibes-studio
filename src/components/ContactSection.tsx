import { motion, useInView } from 'framer-motion';
import { useRef, useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const WHATSAPP_NUMBER = '916282832891';
const INSTAGRAM_URL = 'https://www.instagram.com/luxe_vibe_weddings?igsh=M25neHI1eHZ1eXgy&utm_source=qr';
const PHONE_DISPLAY = '+91 62828 32891';
const PHONE_HREF = 'tel:+916282832891';
const EMAIL = 'luxevibeweddings@gmail.com';

const eventTypes = [
  'Luxury Wedding',
  'Destination Wedding',
  'Corporate Event',
  'Private Celebration',
  'Engagement Party',
  'Anniversary',
  'Other',
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const eventType = data.get('eventType') as string;
    const message = data.get('message') as string;

    const subject = encodeURIComponent(`New Enquiry from ${name} - ${eventType}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEvent Type: ${eventType}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSending(false);
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello Luxe Vibe! 🌸 I'd like to plan my event with you. Could you share more details?");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <section id="contact" className="py-32 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-5xl">
            Contact <span className="text-gradient">Us</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-heading text-2xl mb-6">Plan Your Dream Wedding in Kothamangalam</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10">
              Share your vision with us and we'll create something extraordinary together.
              We serve Kothamangalam, Ernakulam, and all of Kerala.
            </p>

            <address className="space-y-5 not-italic mb-8">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${EMAIL}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a href={PHONE_HREF} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Kothamangalam, Ernakulam, Kerala, India</span>
              </div>
              <div className="flex items-center gap-4">
                <Instagram className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  @luxe_vibe_weddings
                </a>
              </div>
            </address>

            {/* WhatsApp CTA */}
            <motion.button
              onClick={handleWhatsApp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full text-white text-sm font-medium tracking-wide shadow-lg transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 32 32" fill="white" className="w-5 h-5 flex-shrink-0">
                <path d="M16.01 2C8.28 2 2 8.26 2 15.97c0 2.48.65 4.82 1.79 6.85L2 30l7.38-1.77A14.02 14.02 0 0016.01 30c7.73 0 13.99-6.26 13.99-13.97S23.74 2 16.01 2zm0 25.56a11.6 11.6 0 01-5.9-1.6l-.42-.25-4.38 1.05 1.08-4.27-.27-.44a11.55 11.55 0 01-1.77-6.08c0-6.4 5.22-11.6 11.64-11.6 6.43 0 11.65 5.2 11.65 11.6 0 6.4-5.22 11.59-11.63 11.59zm6.38-8.67c-.35-.17-2.06-1.01-2.38-1.13-.32-.11-.56-.17-.8.17-.23.35-.91 1.13-1.12 1.36-.2.23-.41.26-.76.09-.35-.17-1.47-.54-2.8-1.73a10.44 10.44 0 01-1.94-2.41c-.2-.35-.02-.54.15-.71.15-.15.35-.41.52-.61.17-.2.23-.35.35-.58.11-.23.06-.43-.03-.61-.09-.17-.8-1.93-1.09-2.64-.29-.69-.58-.6-.8-.61l-.68-.01c-.23 0-.61.09-.93.43-.32.35-1.22 1.19-1.22 2.91s1.25 3.38 1.42 3.61c.17.23 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.23-.67-.41z" />
              </svg>
              Chat with us on WhatsApp
            </motion.button>

            <div className="mt-8 overflow-hidden border border-border">
              <iframe
                title="Luxevibes location in Kothamangalam, Ernakulam"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62788.37!2d76.59!3d10.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e3a1f2b8c8f7%3A0x2e5b8a3d2c2f9a1b!2sKothamangalam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-5"
          >
            <input
              name="name"
              required
              placeholder="Your Name"
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <select
              name="eventType"
              required
              defaultValue=""
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" disabled className="text-muted-foreground">Select Event Type</option>
              {eventTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell us about your dream event..."
              className="w-full bg-card border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-300 disabled:opacity-50"
              >
                {sent ? '✓ Opening Email Client' : sending ? 'Sending...' : 'Send Enquiry via Email'}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-3.5 text-white text-xs tracking-widest uppercase transition-all duration-300 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                Send via WhatsApp Instead
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
