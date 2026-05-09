import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export function FAQ() {
  const { t } = useI18n();

  return (
    <section id="faq" className="section-divider relative py-32 md:py-40">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
            {t.faq.kicker}
          </p>
          <h2 className="mt-4 display-md text-white">
            {t.faq.title}
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-14"
        >
          <Accordion
            type="single"
            collapsible
            className="luxury-outline space-y-3 rounded-2xl glass p-2 md:p-4"
          >
            {t.faq.items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="luxury-outline border-0 rounded-xl px-6 py-4 transition-all data-[state=open]:bg-white/8 data-[state=open]:shadow-card"
                >
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-white hover:no-underline hover:text-primary transition-colors group">
                    <span className="flex items-start gap-4">
                      <span className="text-primary font-display text-xl group-hover:text-primary/80 transition-colors">
                        +
                      </span>
                      <span className="pt-0.5">{it.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pl-10">
                    {it.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="#chat"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Chat with our AI assistant
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
