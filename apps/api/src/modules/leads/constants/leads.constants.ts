export const LEADS_MODULE = {
  controller: "leads",
} as const;

export enum LeadStatus {
  NEW = "NEW",
  QUALIFIED = "QUALIFIED",
  CONTACTED = "CONTACTED",
  BOOKED = "BOOKED",
  WON = "WON",
  LOST = "LOST",
}

export enum LeadSource {
  WEBSITE = "WEBSITE",
  CHATBOT = "CHATBOT",
  WHATSAPP = "WHATSAPP",
  PHONE = "PHONE",
  REFERRAL = "REFERRAL",
  MANUAL = "MANUAL",
}
