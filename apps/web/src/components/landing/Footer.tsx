import { Sparkles, Instagram, Facebook, Twitter, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative overflow-hidden bg-gradient-dark pb-10 pt-20 text-slate-900">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="luxury-outline mb-16 flex flex-col items-center justify-between gap-6 rounded-[2rem] glass-dark p-8 md:flex-row md:p-12">
          <div>
            <h3 className="text-3xl md:text-4xl font-semibold">{t.footer.ctaTitle}</h3>
            <p className="mt-2 text-slate-600">{t.footer.ctaDescription}</p>
          </div>
          <Button size="lg" className="h-12 px-6" asChild>
            <a href="#booking">{t.footer.book}</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center"><Sparkles className="w-4 h-4" /></div>
              <span className="font-display text-lg font-semibold">Lumière Dental</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{t.footer.tagline}</p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Twitter].map((I, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full glass-dark transition-colors hover:bg-primary/10">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> 432 Park Ave, NYC</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary" /> +1 (555) 123-4567</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" /> hello@lumiere.dental</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.hours}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {t.footer.hoursWeekdays}</li>
              <li className="ml-6">{t.footer.hoursSaturday}</li>
              <li className="ml-6">{t.footer.hoursSunday}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {t.footer.servicesList.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200/80 pt-6 text-xs text-slate-500 md:flex-row">
          <span>© {new Date().getFullYear()} Lumière Dental. {t.footer.rights}</span>
          <span>{t.footer.compliance}</span>
        </div>
      </div>
    </footer>
  );
}
