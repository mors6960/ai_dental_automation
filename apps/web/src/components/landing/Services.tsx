import { motion } from "framer-motion";
import { Sparkles, Smile, Crown, AlignJustify, Siren, Stethoscope } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Sparkles, Crown, Smile, AlignJustify, Siren, Stethoscope];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
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

export function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="section-divider relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
            {t.services.kicker}
          </p>
          <h2 className="mt-4 display-md text-white">
            {t.services.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">
            {t.services.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {t.services.items.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={s.title}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="service-card group relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-gold/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />

                {/* Card background */}
                <div className="luxury-outline premium-panel relative rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-elegant">
                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <Icon className="w-6 h-6" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="mt-6 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>

                  {/* Link */}
                  <motion.div
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80"
                    whileHover={{ x: 4 }}
                  >
                    <span>{t.services.learnMore}</span>
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <path d="M6 12l6-6m0 0l-6-6m6 6h-10" />
                    </motion.svg>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
