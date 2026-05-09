import { motion } from "framer-motion";
import { MessageSquare, CalendarCheck, Phone, Bell, Repeat, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [MessageSquare, CalendarCheck, Bell, Phone, Repeat, Target];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
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

export function AIFeatures() {
  const { t } = useI18n();

  return (
    <section id="ai" className="relative overflow-hidden py-32 md:py-40 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-primary/30 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-gold/20 blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
            {t.ai.kicker}
          </p>
          <h2 className="mt-4 display-md">
            {t.ai.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {t.ai.description}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {t.ai.items.map((f, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="ai-feature-card group relative"
              >
                {/* Gradient border animation on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-gold/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                {/* Card */}
                <div className="luxury-outline rounded-2xl glass-dark p-8 relative h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-elegant">
                  {/* Icon with animation */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.3 }}
                    className="inline-flex"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                      <Icon className="w-5 h-5" />
                    </div>
                  </motion.div>

                  {/* Text content */}
                  <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{f.desc}</p>

                  {/* Accent dot */}
                  <div className="mt-4 h-1 w-8 rounded-full bg-gradient-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
