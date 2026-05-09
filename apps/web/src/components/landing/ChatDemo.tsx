import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Calendar, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function ChatDemo() {
  const { t } = useI18n();
  const script = t.chatDemo.script;
  const [visible, setVisible] = useState(script.slice(0, 1));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(script.slice(0, 1));
  }, [script]);

  useEffect(() => {
    if (visible.length >= script.length) return;
    const timeout = setTimeout(() => setVisible((v) => [...v, script[v.length]]), 1400);
    return () => clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [visible]);

  return (
    <section id="chat" className="section-divider relative py-32 md:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
            {t.chatDemo.kicker}
          </p>
          <h2 className="mt-4 display-md text-white">
            {t.chatDemo.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
            {t.chatDemo.description}
          </p>

          {/* Benefits list */}
          <ul className="mt-10 space-y-4">
            {t.chatDemo.bullets.map((bullet, i) => (
              <motion.li
                key={bullet}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  className="mt-1.5 h-2.5 w-2.5 rounded-full bg-gradient-primary flex-shrink-0"
                />
                <span className="text-foreground/85">{bullet}</span>
              </motion.li>
            ))}
          </ul>

          {/* Replay button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10"
          >
            <Button
              size="lg"
              className="btn-premium bg-gradient-primary hover:bg-gradient-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2"
              onClick={() => setVisible(script.slice(0, 1))}
            >
              <RotateCcw className="w-5 h-5" />
              {t.chatDemo.replay}
            </Button>
          </motion.div>
        </motion.div>

        {/* Right - Chat demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="luxury-outline premium-panel overflow-hidden rounded-3xl shadow-elegant h-[520px] flex flex-col">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-primary/15 via-white/5 to-transparent px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0px oklch(0.72 0.11 205 / 0.4)",
                      "0 0 0 10px oklch(0.72 0.11 205 / 0)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
                >
                  <Bot className="h-5 w-5" />
                </motion.div>
                <div>
                  <div className="font-semibold text-white">{t.floating.aiTitle}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <motion.span
                      animate={{ backgroundColor: ["#22c55e", "#16a34a"] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="h-2 w-2 rounded-full bg-green-500"
                    />
                    {t.chatDemo.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={ref}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-hide"
            >
              <AnimatePresence>
                {visible.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 text-sm rounded-2xl ${
                        m.role === "user"
                          ? "bg-gradient-primary text-primary-foreground rounded-br-sm shadow-glow"
                          : "bg-secondary/80 text-white rounded-bl-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      {m.cta && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-3"
                        >
                          <Button
                            size="sm"
                            className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg"
                            asChild
                          >
                            <a href="#booking" className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {t.chatDemo.cta}
                            </a>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="border-t border-white/10 bg-gradient-to-t from-background via-background/95 to-background/50 px-4 py-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-full border border-white/15 bg-white/8 px-4 py-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                  placeholder={t.chatDemo.inputPlaceholder}
                  readOnly
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow transition-all"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
