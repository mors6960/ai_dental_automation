import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Bot, X, Send, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function FloatingActions() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const buttonVariants = {
    initial: { opacity: 0, scale: 0, y: 0 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.1 + i * 0.1, type: "spring", stiffness: 260, damping: 20 },
    }),
    exit: { opacity: 0, scale: 0, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      {/* Floating Action Buttons Container */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed bottom-6 right-6 z-40"
      >
        <AnimatePresence>
          {/* Expanded chat window */}
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.85 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute bottom-0 right-0 w-96 overflow-hidden rounded-3xl glass shadow-elegant border border-white/10"
            >
              {/* Header with gradient */}
              <div className="relative overflow-hidden bg-gradient-primary text-primary-foreground p-6">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40" />
                </div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-lg" />
                      <Bot className="w-6 h-6 relative z-10" />
                    </motion.div>
                    <div>
                      <div className="font-bold text-lg">{t.floating.aiTitle}</div>
                      <motion.div
                        className="text-xs opacity-90 flex items-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="h-2 w-2 rounded-full bg-green-300"
                        />
                        {t.floating.aiStatus}
                      </motion.div>
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Messages area */}
              <div className="h-72 overflow-y-auto px-5 py-6 space-y-4 bg-gradient-to-b from-background/50 to-background">
                {/* AI Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-xs rounded-2xl rounded-bl-lg bg-secondary/90 px-5 py-3 text-sm leading-relaxed text-white shadow-card">
                    {t.floating.aiGreeting}
                  </div>
                </motion.div>

                {/* Suggested response */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                    className="px-4 py-2 rounded-full bg-gradient-primary/20 border border-primary/40 text-xs font-semibold text-primary hover:bg-gradient-primary/30 transition-colors"
                  >
                    💬 Book Appointment
                  </motion.button>
                </motion.div>
              </div>

              {/* Input area */}
              <div className="border-t border-white/10 bg-gradient-to-b from-background/20 to-background/50 px-4 py-4 flex gap-3">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder={t.floating.inputPlaceholder}
                  readOnly
                  className="flex-1 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-white/12 transition-all backdrop-blur-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.12, boxShadow: "0 0 20px rgba(190, 130, 255, 0.5)" }}
                  whileTap={{ scale: 0.9 }}
                  className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons - Animated Stack */}
        <div className="relative h-20 w-20">
          {/* WhatsApp Button - Slides left when chat opens */}
          <motion.a
            href="https://wa.me/15551234567"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            custom={0}
            variants={{
              initial: { opacity: 0, scale: 0, x: 0, y: 0 },
              animate: {
                opacity: 1,
                scale: 1,
                x: open ? -80 : 0,
                y: open ? -20 : 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.4,
                },
              },
              exit: { opacity: 0, scale: 0 },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={{ scale: open ? 1.1 : 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-0 right-0 relative grid h-14 w-14 place-items-center overflow-hidden rounded-full text-white shadow-glow transition-all"
            style={{ background: "var(--whatsapp)" }}
          >
            {/* Animated rings */}
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.4, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
              }}
              className="absolute inset-0 rounded-full border-2 border-white/40"
            />
            <motion.span
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                delay: 0.2,
              }}
              className="absolute inset-0 rounded-full border-2 border-white/25"
            />

            {/* Border */}
            <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/60" />

            {/* Icon with glow */}
            <div className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <Phone className="w-7 h-7" />
            </div>

            {/* Label on hover */}
            {open && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-full mr-3 text-xs font-semibold whitespace-nowrap bg-gradient-primary px-3 py-1.5 rounded-lg text-primary-foreground"
              >
                Message Us
              </motion.div>
            )}
          </motion.a>

          {/* AI Chat Toggle Button - Main button */}
          <motion.button
            onClick={() => setOpen(!open)}
            aria-label="AI Chat"
            custom={1}
            variants={{
              initial: { opacity: 0, scale: 0 },
              animate: {
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                },
              },
              exit: { opacity: 0, scale: 0 },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            className="absolute bottom-0 right-0 relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-all"
          >
            {/* Pulse rings */}
            <motion.span
              animate={{
                scale: [1, 1.25, 1],
                opacity: [1, 0.4, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="absolute inset-0 rounded-full border-2 border-white/40"
            />
            <motion.span
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 0.2, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-full border-2 border-white/25"
            />

            {/* Outer border */}
            <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/60" />

            {/* Icon with rotation */}
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              {open ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
            </motion.div>

            {/* Badge indicator */}
            {!open && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-glow border-2 border-primary"
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Backdrop when chat is open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}
