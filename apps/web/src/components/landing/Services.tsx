import { motion } from "framer-motion";
import { Sparkles, Smile, Crown, AlignJustify, Siren, Stethoscope } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Sparkles, Crown, Smile, AlignJustify, Siren, Stethoscope];

export function Services() {
  const { t } = useI18n();
  return (
    <section id="services" className="section-divider py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.services.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">{t.services.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.services.description}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.services.items.map((s, i) => {
            const Icon = icons[i];
            return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="premium-panel luxury-outline group relative overflow-hidden rounded-[1.7rem] p-7 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/4 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <div className="mt-5 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">{t.services.learnMore} →</div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
