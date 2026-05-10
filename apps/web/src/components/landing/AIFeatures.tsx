import { motion } from "framer-motion";
import { MessageSquare, CalendarCheck, Phone, Bell, Repeat, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [MessageSquare, CalendarCheck, Bell, Phone, Repeat, Target];

export function AIFeatures() {
  const { t } = useI18n();
  return (
    <section id="ai" className="relative overflow-hidden py-24 text-slate-950">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.ai.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">{t.ai.title}</h2>
          <p className="mt-4 text-lg text-slate-600">{t.ai.description}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.ai.items.map((f, i) => {
            const Icon = icons[i];
            return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="luxury-outline rounded-[1.6rem] glass-dark p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
