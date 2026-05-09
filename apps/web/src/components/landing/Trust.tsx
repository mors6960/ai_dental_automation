import { motion } from "framer-motion";
import { Star, ShieldCheck, Award, BadgeCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const certs = [
  { icon: ShieldCheck },
  { icon: Award },
  { icon: BadgeCheck },
  { icon: Star },
];

const reviewVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

export function Trust() {
  const { t } = useI18n();

  return (
    <section className="section-divider relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
              {t.trust.kicker}
            </p>
            <h2 className="mt-4 display-md text-white">
              {t.trust.title}
            </h2>
          </motion.div>

          {/* Rating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="luxury-outline flex items-center gap-3 rounded-full glass px-6 py-3 w-fit whitespace-nowrap"
          >
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.08,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <Star className="w-5 h-5 fill-gold text-gold" />
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">4.9</span>
              <span className="text-xs text-muted-foreground">{t.trust.ratingLabel}</span>
            </div>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-3 mb-16"
        >
          {t.trust.reviews.map((r, i) => (
            <motion.div
              key={r.name}
              variants={reviewVariants}
              whileHover={{ y: -4 }}
              className="review-card group relative"
            >
              <div className="luxury-outline premium-panel relative rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-elegant">
                {/* Star rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-base leading-relaxed text-foreground/80">
                  "{r.text}"
                </p>

                {/* Author */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <p className="text-sm font-semibold text-white">— {r.name}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-16"
        >
          {certs.map((c, index) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={t.trust.certs[index]}
                whileHover={{ scale: 1.05 }}
                className="luxury-outline premium-panel flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:shadow-card"
              >
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{t.trust.certs[index]}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Transformations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={reviewVariants}
              whileHover={{ y: -4 }}
              className="transformation-card group relative overflow-hidden"
            >
              <div className="luxury-outline premium-panel relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-elegant">
                {/* Before/After visual */}
                <div className="grid grid-cols-2 aspect-[3/2]">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid place-items-center bg-gradient-dark relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-secondary/30" />
                    <span className="relative text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                      {t.trust.before}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid place-items-center bg-gradient-primary relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-20" />
                    <span className="relative text-xs uppercase tracking-widest text-primary-foreground font-semibold">
                      {t.trust.after}
                    </span>
                  </motion.div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-2">
                  <div className="font-semibold text-white">
                    {t.trust.transformation} #{i}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.trust.visits}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
