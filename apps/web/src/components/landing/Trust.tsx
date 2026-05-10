import { motion } from "framer-motion";
import { Star, ShieldCheck, Award, BadgeCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const certs = [
  { icon: ShieldCheck },
  { icon: Award },
  { icon: BadgeCheck },
  { icon: Star },
];

export function Trust() {
  const { t } = useI18n();
  return (
    <section className="section-divider py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div>
            <p className="section-kicker text-xs uppercase text-muted-foreground">{t.trust.kicker}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">{t.trust.title}</h2>
          </div>
          <div className="luxury-outline flex items-center gap-2 rounded-full glass px-4 py-2">
            {[0,1,2,3,4].map(i => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
            <span className="font-semibold">4.9 / 5</span>
            <span className="text-sm text-muted-foreground">{t.trust.ratingLabel}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {t.trust.reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="premium-panel luxury-outline rounded-[1.7rem] p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({length: r.rating}).map((_,k) => <Star key={k} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <p className="leading-relaxed text-slate-700">"{r.text}"</p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">— {r.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {certs.map((c, index) => (
            <div key={t.trust.certs[index]} className="premium-panel luxury-outline flex items-center gap-3 rounded-xl px-4 py-3">
              <c.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{t.trust.certs[index]}</span>
            </div>
          ))}
        </div>

        {/* Before / after */}
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="premium-panel luxury-outline overflow-hidden rounded-2xl"
            >
              <div className="grid grid-cols-2 aspect-[2/1]">
                <div className="grid place-items-center bg-gradient-to-br from-muted/70 to-secondary">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.trust.before}</span>
                </div>
                <div className="bg-gradient-primary grid place-items-center">
                  <span className="text-xs uppercase tracking-widest text-primary-foreground/90">{t.trust.after}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="font-medium">{t.trust.transformation} #{i}</div>
                <div className="text-sm text-muted-foreground">{t.trust.visits}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
