import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export function FAQ() {
  const { t } = useI18n();
  return (
    <section id="faq" className="section-divider py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.faq.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{t.faq.title}</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 rounded-[1.8rem] border border-white/8 bg-white/4 px-6 backdrop-blur-xl">
          {t.faq.items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/8">
              <AccordionTrigger className="text-left text-lg font-medium text-white hover:no-underline">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
