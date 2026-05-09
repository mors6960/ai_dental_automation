import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function FloatingActions() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* WhatsApp */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          href="https://wa.me/15551234567"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full text-white shadow-elegant transition-transform hover:scale-110"
          style={{ background: "var(--whatsapp)" }}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-white/35" />
          <span className="pointer-events-none absolute inset-[3px] rounded-full bg-white/10" />
          <svg viewBox="0 0 32 32" className="relative z-10 h-7 w-7 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.28)]">
            <path d="M27.3 4.7A15.18 15.18 0 0 0 16.49.02C8.17.02 1.4 6.77 1.4 15.1c0 2.65.69 5.24 2 7.53L.02 32l9.62-3.24a15.05 15.05 0 0 0 6.85 1.64h.01c8.31 0 15.09-6.76 15.09-15.09 0-4.03-1.57-7.82-4.29-10.6Zm-10.8 23.15h-.01a12.5 12.5 0 0 1-6.37-1.74l-.46-.27-5.71 1.93 1.87-5.57-.3-.48a12.54 12.54 0 0 1-1.92-6.63c0-6.91 5.63-12.54 12.56-12.54 3.35 0 6.49 1.3 8.85 3.67a12.45 12.45 0 0 1 3.66 8.86c0 6.92-5.63 12.56-12.55 12.56Zm6.88-9.39c-.37-.18-2.2-1.08-2.54-1.2-.34-.12-.59-.18-.84.19-.25.37-.96 1.19-1.18 1.44-.22.25-.44.28-.81.09-.37-.19-1.57-.58-2.99-1.84-1.1-.98-1.85-2.18-2.06-2.55-.22-.37-.02-.57.16-.75.16-.16.37-.43.56-.65.19-.22.25-.37.37-.62.12-.25.06-.46-.03-.65-.09-.19-.84-2.03-1.15-2.78-.3-.73-.61-.63-.84-.64l-.72-.01c-.25 0-.65.09-.99.46-.34.37-1.31 1.28-1.31 3.12s1.34 3.62 1.53 3.87c.19.25 2.63 4.01 6.37 5.62.89.38 1.58.61 2.12.77.89.28 1.7.24 2.34.15.71-.11 2.2-.9 2.51-1.77.31-.87.31-1.62.22-1.77-.09-.15-.34-.25-.71-.43Z" />
          </svg>
        </a>
      </div>

      {/* AI Chat widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="luxury-outline absolute bottom-16 right-0 w-[340px] overflow-hidden rounded-3xl glass shadow-elegant"
            >
              <div className="p-4 bg-gradient-primary text-primary-foreground">
                <div className="font-semibold">{t.floating.aiTitle}</div>
                <div className="text-xs opacity-80">{t.floating.aiStatus}</div>
              </div>
              <div className="h-56 space-y-2 overflow-y-auto p-4 text-sm">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-white">
                  {t.floating.aiGreeting}
                </div>
              </div>
              <div className="flex gap-2 border-t border-white/8 p-3">
                <input className="flex-1 rounded-full border border-white/8 bg-secondary px-4 py-2 text-sm outline-none placeholder:text-muted-foreground" placeholder={t.floating.inputPlaceholder} />
                <button className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen(!open)}
          aria-label="AI Chat"
          className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform hover:scale-110"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-white/30" />
          {open ? <X className="relative z-10 w-6 h-6" /> : <Bot className="relative z-10 w-6 h-6" />}
        </button>
      </div>
    </>
  );
}
