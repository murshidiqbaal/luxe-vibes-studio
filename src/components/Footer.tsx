import { useQuery } from '@tanstack/react-query';
import { getContentDocument } from '@/lib/supabase';
import logo from '@/assets/luxevibelogo.png';

const INSTAGRAM_URL = 'https://www.instagram.com/luxe_vibe_weddings?igsh=M25neHI1eHZ1eXgy&utm_source=qr';
const WHATSAPP_NUMBER = '916282832891';
const EMAIL = 'luxevibeweddings@gmail.com';
const PHONE_DISPLAY = '+91 62828 32891';
const PHONE_HREF = 'tel:+916282832891';

export default function Footer() {
  const { data: footerData } = useQuery({
    queryKey: ['footerContent'],
    queryFn: async () => {
      try {
        const doc = await getContentDocument('text_content');
        if (doc.data) {
          return JSON.parse(doc.data);
        }
        return null;
      } catch (error) {
        return null;
      }
    }
  });

  const description = footerData?.footer_text || "Crafting beautiful stories for the most discerning clients across Kerala and beyond.";

  return (
    <footer className="bg-background py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src={logo} alt="Luxe Vibe Logo" className="w-24" />
            <p className="text-muted-foreground text-xs leading-relaxed tracking-wide text-center md:text-left max-w-xs">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-2">Navigate</p>
            <nav className="flex flex-col items-center gap-3">
              {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-2">Contact</p>

            <a href={PHONE_HREF} className="text-lg font-heading hover:text-primary transition-colors">
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-widest">
              {EMAIL}
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Luxe Vibe on Instagram"
                className="group flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Luxe Vibe on WhatsApp"
                className="group flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-[#25D366] transition-all duration-300"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 text-muted-foreground group-hover:text-[#25D366] transition-colors" fill="currentColor">
                  <path d="M16.01 2C8.28 2 2 8.26 2 15.97c0 2.48.65 4.82 1.79 6.85L2 30l7.38-1.77A14.02 14.02 0 0016.01 30c7.73 0 13.99-6.26 13.99-13.97S23.74 2 16.01 2zm6.38 19.06c-.35-.17-2.06-1.01-2.38-1.13-.32-.11-.56-.17-.8.17-.23.35-.91 1.13-1.12 1.36-.2.23-.41.26-.76.09-.35-.17-1.47-.54-2.8-1.73a10.44 10.44 0 01-1.94-2.41c-.2-.35-.02-.54.15-.71.15-.15.35-.41.52-.61.17-.2.23-.35.35-.58.11-.23.06-.43-.03-.61-.09-.17-.8-1.93-1.09-2.64-.29-.69-.58-.6-.8-.61l-.68-.01c-.23 0-.61.09-.93.43-.32.35-1.22 1.19-1.22 2.91s1.25 3.38 1.42 3.61c.17.23 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.23-.67-.41z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Luxe Vibe Studio. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
