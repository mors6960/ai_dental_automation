import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Calendar } from "lucide-react";
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
    const t = setTimeout(() => setVisible(v => [...v, script[v.length]]), 1400);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [visible]);

  return (
    <section id="chat" className="section-divider py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.chatDemo.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{t.chatDemo.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.chatDemo.description}</p>
          <ul className="mt-8 space-y-4">
            {t.chatDemo.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8" onClick={() => setVisible(script.slice(0, 1))}>
            {t.chatDemo.replay}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="premium-panel luxury-outline overflow-hidden rounded-[2rem]"
        >
          <div className="flex items-center gap-3 border-b border-white/8 bg-gradient-to-r from-primary/10 via-white/4 to-transparent p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white">{t.floating.aiTitle}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-whatsapp animate-pulse" /> {t.chatDemo.status}
              </div>
            </div>
          </div>
          <div ref={ref} className="h-[420px] overflow-y-auto p-5 space-y-3">
            <AnimatePresence>
              {visible.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 text-sm rounded-2xl ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-white rounded-tl-sm"
                  }`}>
                    {m.text}
                    {m.cta && (
                      <Button size="sm" variant="outline" className="mt-3 w-full bg-white/5 text-white hover:bg-white/10">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> {t.chatDemo.cta}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2 border-t border-white/8 p-3">
            <input className="flex-1 rounded-full border border-white/8 bg-secondary px-4 py-2 text-sm outline-none placeholder:text-muted-foreground" placeholder={t.chatDemo.inputPlaceholder} readOnly />
            <Button size="icon" className="rounded-full">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
