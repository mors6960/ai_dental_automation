import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const testimonialVariants = {
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

export function Testimonials() {
  const { t } = useI18n();

  return (
    <section id="testimonials" className="section-divider relative py-32 md:py-40">
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
            {t.testimonials.kicker}
          </p>
          <h2 className="mt-4 display-md text-white">
            {t.testimonials.title}
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
          className="mt-16 grid gap-6 md:grid-cols-2"
        >
          {t.testimonials.items.map((item, i) => (
            <motion.div
              key={item.name}
              variants={testimonialVariants}
              whileHover={{ y: -4 }}
              className="testimonial-card group relative"
            >
              <div className="luxury-outline premium-panel relative rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-elegant">
                {/* Decorative quote icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-6 right-6"
                >
                  <Quote className="w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
                </motion.div>

                {/* Star rating */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, staggerChildren: 0.05 }}
                  className="flex gap-1 mb-5"
                >
                  {[0, 1, 2, 3, 4].map((k) => (
                    <motion.div
                      key={k}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + k * 0.05 }}
                    >
                      <Star className="w-4 h-4 fill-gold text-gold" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Testimonial text */}
                <p className="text-lg leading-relaxed text-foreground/85">
                  "{item.text}"
                </p>

                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex items-center gap-4 pt-6 border-t border-white/10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-11 h-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold shadow-glow"
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.role}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
