import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useI18n();
  return (
    <section id="testimonials" className="section-divider py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.testimonials.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{t.testimonials.title}</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {t.testimonials.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="premium-panel luxury-outline relative rounded-[1.9rem] p-8 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              <div className="flex gap-1 mb-4">
                {[0,1,2,3,4].map(k => <Star key={k} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <p className="font-display text-lg leading-relaxed text-white">"{item.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
