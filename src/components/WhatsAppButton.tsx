import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const WHATSAPP_NUMBER = '916282832891'; // Country code + number (no +)
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Luxe Vibe! 🌸 I'd like to enquire about your wedding/event planning services. Could you please share more details?"
);

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.5, type: 'spring', stiffness: 200 }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1a1a1a] border border-white/10 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl backdrop-blur-sm whitespace-nowrap font-light tracking-wide"
          >
            Chat with us on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Luxe Vibe on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

        {/* WhatsApp SVG */}
        <svg
          viewBox="0 0 32 32"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 relative z-10"
        >
          <path d="M16.01 2C8.28 2 2 8.26 2 15.97c0 2.48.65 4.82 1.79 6.85L2 30l7.38-1.77A14.02 14.02 0 0016.01 30c7.73 0 13.99-6.26 13.99-13.97S23.74 2 16.01 2zm0 25.56a11.6 11.6 0 01-5.9-1.6l-.42-.25-4.38 1.05 1.08-4.27-.27-.44a11.55 11.55 0 01-1.77-6.08c0-6.4 5.22-11.6 11.64-11.6 6.43 0 11.65 5.2 11.65 11.6 0 6.4-5.22 11.59-11.63 11.59zm6.38-8.67c-.35-.17-2.06-1.01-2.38-1.13-.32-.11-.56-.17-.8.17-.23.35-.91 1.13-1.12 1.36-.2.23-.41.26-.76.09-.35-.17-1.47-.54-2.8-1.73a10.44 10.44 0 01-1.94-2.41c-.2-.35-.02-.54.15-.71.15-.15.35-.41.52-.61.17-.2.23-.35.35-.58.11-.23.06-.43-.03-.61-.09-.17-.8-1.93-1.09-2.64-.29-.69-.58-.6-.8-.61l-.68-.01c-.23 0-.61.09-.93.43-.32.35-1.22 1.19-1.22 2.91s1.25 3.38 1.42 3.61c.17.23 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.23-.67-.41z" />
        </svg>
      </motion.a>
    </motion.div>
  );
}
