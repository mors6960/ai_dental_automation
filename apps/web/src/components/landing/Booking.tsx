import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Clock, LoaderCircle } from "lucide-react";

import { useCreateAppointment } from "@/hooks/use-create-appointment";
import { useCreateLead } from "@/hooks/use-create-lead";
import {
  BOOKING_SERVICE_CONFIG,
  type BookingServiceKey,
} from "@/lib/landing-api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useLandingExperience } from "@/components/landing/landing-experience";

const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const serviceKeys = [
  "whitening",
  "implants",
  "invisalign",
  "cleaning",
  "emergency",
] as const satisfies BookingServiceKey[];

function buildAppointmentWindow(
  selectedDate: Date,
  time: string,
  durationMinutes: number,
) {
  const [hours, minutes] = time.split(":").map(Number);
  const startAt = new Date(selectedDate);
  startAt.setHours(hours ?? 0, minutes ?? 0, 0, 0);

  const endAt = new Date(startAt);
  endAt.setMinutes(endAt.getMinutes() + durationMinutes);

  return {
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
  };
}

export function Booking() {
  const { t, language } = useI18n();
  const { bookingDraft, setBookingDraft } = useLandingExperience();
  const createLeadMutation = useCreateLead();
  const createAppointmentMutation = useCreateAppointment();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:30");
  const [doneMessage, setDoneMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedService = bookingDraft.serviceKey;
  const isSubmitting =
    createLeadMutation.isPending || createAppointmentMutation.isPending;

  async function handleSubmit() {
    if (!bookingDraft.fullName.trim()) {
      setErrorMessage("Please add your full name before confirming.");
      return;
    }

    if (!bookingDraft.phone.trim()) {
      setErrorMessage("Please add your WhatsApp number before confirming.");
      return;
    }

    if (!date) {
      setErrorMessage("Please select a preferred appointment date.");
      return;
    }

    setErrorMessage(null);
    setDoneMessage(null);

    const serviceConfig = BOOKING_SERVICE_CONFIG[selectedService];
    const appointmentWindow = buildAppointmentWindow(
      date,
      time,
      serviceConfig.durationMinutes,
    );

    try {
      const leadResult = await createLeadMutation.mutateAsync({
        fullName: bookingDraft.fullName.trim(),
        phone: bookingDraft.phone.trim(),
        whatsappNumber: bookingDraft.phone.trim(),
        source: "WEBSITE",
        serviceInterest: serviceConfig.label,
        inquiryType: serviceConfig.label,
        preferredLanguage: language,
      });

      const appointmentResult = await createAppointmentMutation.mutateAsync({
        patientName: bookingDraft.fullName.trim(),
        patientPhone: bookingDraft.phone.trim(),
        leadId: leadResult.data.id,
        serviceName: serviceConfig.label,
        source: "WEBSITE",
        startAt: appointmentWindow.startAt,
        endAt: appointmentWindow.endAt,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        confirmationChannel: "WHATSAPP",
      });

      setDoneMessage(
        `${appointmentResult.message} ${new Date(
          appointmentResult.data.startAt,
        ).toLocaleString()}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not confirm the appointment right now.",
      );
    }
  }

  return (
    <section id="booking" className="section-divider py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker text-xs font-semibold uppercase text-primary">
            {t.booking.kicker}
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
            {t.booking.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.booking.description}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="premium-panel luxury-outline mt-12 grid gap-6 rounded-[2rem] p-6 md:p-8 lg:grid-cols-[auto_1fr]"
        >
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className={cn("pointer-events-auto p-3")}
            />
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">
                {t.booking.serviceLabel}
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {serviceKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setBookingDraft({ serviceKey: key })}
                    className={cn(
                      "button-3d rounded-full border px-4 py-2 text-sm text-slate-700 transition-all",
                      selectedService === key
                        ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                        : "border-slate-200/80 bg-white text-slate-700 hover:border-primary/40 hover:text-slate-950",
                    )}
                  >
                    {t.booking.services[key]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" /> {t.booking.availableTimes}
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {times.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={cn(
                      "button-3d rounded-xl border py-2 text-sm font-medium transition-all",
                      time === slot
                        ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                        : "border-slate-200/80 bg-white text-slate-700 hover:border-primary/40 hover:text-slate-950",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder={t.booking.namePlaceholder}
                value={bookingDraft.fullName}
                onChange={(event) =>
                  setBookingDraft({ fullName: event.target.value })
                }
              />
              <Input
                placeholder={t.booking.whatsappPlaceholder}
                type="tel"
                value={bookingDraft.phone}
                onChange={(event) =>
                  setBookingDraft({ phone: event.target.value })
                }
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-rose-500">{errorMessage}</p>
            ) : null}
            {doneMessage ? (
              <p className="text-sm text-emerald-600">{doneMessage}</p>
            ) : null}
            <Button
              size="lg"
              onClick={handleSubmit}
              className="h-12 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {t.booking.confirm}
                </>
              ) : doneMessage ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t.booking.confirmed}
                </>
              ) : (
                t.booking.confirm
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {t.booking.disclaimer}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
