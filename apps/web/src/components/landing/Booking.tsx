import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Check, Clock, Sparkles } from "lucide-react";
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
    <section id="booking" className="section-divider relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="section-kicker text-xs font-semibold uppercase text-primary tracking-widest">
            {t.booking.kicker}
          </p>
          <h2 className="mt-4 display-md text-white">
            {t.booking.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            {t.booking.description}
          </p>
        </motion.div>

        {/* Booking form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-16"
        >
          <AnimatePresence mode="wait">
            {!done ? (
              <div className="luxury-outline premium-panel grid gap-8 rounded-3xl p-8 md:p-10 lg:grid-cols-[380px_1fr]">
                {/* Calendar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-gradient-dark p-4"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </motion.div>

                {/* Form content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Service selection */}
                  <div>
                    <label className="text-sm font-semibold text-white uppercase tracking-wide">
                      {t.booking.serviceLabel}
                    </label>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {serviceKeys.map((key) => (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setService(key)}
                          className={cn(
                            "px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300",
                            service === key
                              ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                              : "border-white/15 bg-white/5 hover:border-primary/50 hover:bg-white/8"
                          )}
                        >
                          {t.booking.services[key]}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Time selection */}
                  <div>
                    <label className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {t.booking.availableTimes}
                    </label>
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {times.map((timeSlot) => (
                        <motion.button
                          key={timeSlot}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTime(timeSlot)}
                          className={cn(
                            "py-3 rounded-lg text-sm font-medium border transition-all duration-300",
                            time === timeSlot
                              ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                              : "border-white/15 bg-white/5 hover:border-primary/50"
                          )}
                        >
                          {timeSlot}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder={t.booking.namePlaceholder}
                      className="rounded-lg border-white/15 bg-white/8 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                    />
                    <Input
                      placeholder={t.booking.whatsappPlaceholder}
                      type="tel"
                      className="rounded-lg border-white/15 bg-white/8 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                    />
                  </div>

                  {/* Submit button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      onClick={() => setDone(true)}
                      className="btn-premium w-full h-13 bg-gradient-primary hover:bg-gradient-primary text-primary-foreground rounded-lg font-semibold text-base"
                    >
                      {t.booking.confirm}
                    </Button>
                  </motion.div>

                  {/* Disclaimer */}
                  <p className="text-xs text-muted-foreground text-center">
                    {t.booking.disclaimer}
                  </p>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="luxury-outline premium-panel rounded-3xl p-12 md:p-16 text-center max-w-2xl mx-auto"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-flex justify-center mb-6"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-gold/20 border border-gold flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Check className="h-8 w-8 text-gold" />
                    </motion.div>
                  </div>
                </motion.div>

                <h3 className="text-3xl font-display font-semibold text-white mb-3">
                  {t.booking.confirmed}
                </h3>
                <p className="text-lg text-foreground/70 mb-8">
                  {date?.toLocaleDateString()} at {time}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-10">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Check your WhatsApp for appointment confirmation
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setDone(false)}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  ← {t.booking.kicker}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
