import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { LandingChatPanel } from "@/components/landing/LandingChatPanel";
import { useLandingExperience } from "@/components/landing/landing-experience";
import { useI18n } from "@/lib/i18n";

export function ChatDemo() {
  const { t } = useI18n();
  const { resetChat } = useLandingExperience();

  return (
    <section id="chat" className="section-divider py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.chatDemo.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">{t.chatDemo.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.chatDemo.description}</p>
          <ul className="mt-8 space-y-4">
            {t.chatDemo.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8" onClick={resetChat}>
            {t.chatDemo.replay}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="premium-panel luxury-outline overflow-hidden rounded-[2rem]"
        >
          <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-primary/10 via-white/60 to-transparent p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-950">{t.floating.aiTitle}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-whatsapp animate-pulse" /> {t.chatDemo.status}
              </div>
            </div>
          </div>
          <LandingChatPanel
            greeting={t.floating.aiGreeting}
            inputPlaceholder={t.chatDemo.inputPlaceholder}
            bookingCtaLabel={t.chatDemo.cta}
            bodyClassName="h-[420px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
