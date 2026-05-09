import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const serviceKeys = ["whitening", "implants", "invisalign", "cleaning", "emergency"] as const;

export function Booking() {
  const { t } = useI18n();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:30");
  const [service, setService] = useState<(typeof serviceKeys)[number]>("whitening");
  const [done, setDone] = useState(false);

  return (
    <section id="booking" className="section-divider py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">{t.booking.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{t.booking.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.booking.description}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="premium-panel luxury-outline mt-12 grid gap-6 rounded-[2rem] p-6 md:p-8 lg:grid-cols-[auto_1fr]"
        >
          <div className="rounded-2xl border border-white/8 bg-background/40 p-2">
            <Calendar mode="single" selected={date} onSelect={setDate} className={cn("p-3 pointer-events-auto")} />
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">{t.booking.serviceLabel}</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {serviceKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setService(key)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm border transition-all",
                      service === key
                        ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                        : "border-white/10 bg-white/4 hover:border-primary/40"
                    )}
                  >
                    {t.booking.services[key]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> {t.booking.availableTimes}</label>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {times.map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={cn(
                      "py-2 rounded-lg text-sm border transition-all",
                      time === t
                        ? "border-transparent bg-white text-background"
                        : "border-white/10 bg-white/4 hover:border-primary/40"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder={t.booking.namePlaceholder} />
              <Input placeholder={t.booking.whatsappPlaceholder} type="tel" />
            </div>
            <Button
              size="lg"
              onClick={() => setDone(true)}
              className="h-12 w-full text-base"
            >
              {done ? <><Check className="w-4 h-4 mr-2" /> {t.booking.confirmed}</> : t.booking.confirm}
            </Button>
            <p className="text-xs text-muted-foreground text-center">{t.booking.disclaimer}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
