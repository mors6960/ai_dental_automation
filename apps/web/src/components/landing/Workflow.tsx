import { motion } from "framer-motion";
import { Globe, MessageCircle, MessagesSquare, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Globe, MessageCircle, MessagesSquare, Calendar, CheckCircle2];

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

export function Workflow() {
  const { t } = useI18n();

  return (
    <section className="section-divider relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
            {t.workflow.kicker}
          </p>
          <h2 className="mt-4 display-md text-white">
            {t.workflow.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            {t.workflow.description}
          </p>
        </motion.div>

        {/* Workflow steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}
          className="mt-20 flex flex-col md:flex-row items-stretch justify-center gap-4"
        >
          {t.workflow.steps.map((s, i) => {
            const Icon = icons[i];
            const isLast = i === t.workflow.steps.length - 1;

            return (
              <motion.div
                key={s.title}
                variants={stepVariants}
                whileHover={{ y: -6 }}
                className="workflow-step group relative flex md:flex-row flex-col items-center gap-4 md:flex-1"
              >
                {/* Step card */}
                <div className="luxury-outline premium-panel relative flex-1 w-full rounded-2xl p-8 text-center transition-all duration-300 group-hover:shadow-elegant">
                  {/* Step number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold shadow-glow"
                  >
                    {i + 1}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.3 }}
                    className="inline-flex"
                  >
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                      <Icon className="w-6 h-6" />
                    </div>
                  </motion.div>

                  {/* Text content */}
                  <h3 className="mt-6 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>

                {/* Connector arrow */}
                {!isLast && (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="shrink-0"
                  >
                    <ArrowRight className="w-5 h-5 text-primary/60 hidden md:block md:rotate-0" />
                    <ArrowRight className="w-5 h-5 text-primary/60 md:hidden rotate-90" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom success message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-gradient-primary/10 border border-primary/20 max-w-md mx-auto"
        >
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm font-medium text-foreground">
            Fully automated, AI-powered, 24/7 available
          </span>
        </motion.div>
      </div>
    </section>
  );
}
