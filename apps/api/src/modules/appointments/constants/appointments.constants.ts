export const APPOINTMENTS_MODULE = {
  controller: "appointments",
} as const;

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  RESCHEDULED = "RESCHEDULED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export enum AppointmentSource {
  WEBSITE = "WEBSITE",
  CHATBOT = "CHATBOT",
  WHATSAPP = "WHATSAPP",
  PHONE = "PHONE",
  MANUAL = "MANUAL",
}
