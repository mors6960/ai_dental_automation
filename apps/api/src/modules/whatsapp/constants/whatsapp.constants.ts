export const WHATSAPP_MODULE = {
  controller: "whatsapp",
} as const;

export enum WhatsappMessageStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}
