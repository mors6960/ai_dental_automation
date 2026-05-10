import { motion } from "framer-motion";
import { Globe, MessageCircle, MessagesSquare, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Globe, MessageCircle, MessagesSquare, Calendar, CheckCircle2];

export function Workflow() {
  const { t } = useI18n();
  return (
    <section className="section-divider py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.workflow.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">{t.workflow.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.workflow.description}</p>
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-stretch justify-center gap-3">
          {t.workflow.steps.map((s, i) => {
            const Icon = icons[i];
            return (
            <div key={s.title} className="flex md:flex-row flex-col items-center gap-3 md:flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="premium-panel luxury-outline flex-1 w-full rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-4 font-semibold">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </motion.div>
              {i < t.workflow.steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-primary/50 shrink-0 md:rotate-0 rotate-90" />
              )}
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
