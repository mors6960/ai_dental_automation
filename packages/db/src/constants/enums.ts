export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  DENTIST = "DENTIST",
  RECEPTIONIST = "RECEPTIONIST",
  MARKETING = "MARKETING",
  SUPPORT = "SUPPORT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
  SUSPENDED = "SUSPENDED",
  ARCHIVED = "ARCHIVED",
}

export enum LeadStatus {
  NEW = "NEW",
  QUALIFIED = "QUALIFIED",
  CONTACTED = "CONTACTED",
  BOOKED = "BOOKED",
  WON = "WON",
  LOST = "LOST",
  ARCHIVED = "ARCHIVED",
}

export enum LeadSource {
  WEBSITE = "WEBSITE",
  CHATBOT = "CHATBOT",
  WHATSAPP = "WHATSAPP",
  PHONE = "PHONE",
  REFERRAL = "REFERRAL",
  GOOGLE = "GOOGLE",
  META_ADS = "META_ADS",
  WALK_IN = "WALK_IN",
  MANUAL = "MANUAL",
}

export enum ConversationChannel {
  WEB_CHAT = "WEB_CHAT",
  WHATSAPP = "WHATSAPP",
  SMS = "SMS",
  EMAIL = "EMAIL",
  VOICE = "VOICE",
}

export enum MessageRole {
  SYSTEM = "SYSTEM",
  AI = "AI",
  USER = "USER",
  AGENT = "AGENT",
}

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

export enum ReminderStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum ReviewRequestStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  OPENED = "OPENED",
  RESPONDED = "RESPONDED",
  EXPIRED = "EXPIRED",
  FAILED = "FAILED",
}

export enum ReviewStatus {
  PUBLISHED = "PUBLISHED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export enum IntegrationProvider {
  OPENAI = "OPENAI",
  TWILIO = "TWILIO",
  GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
  CALENDLY = "CALENDLY",
  VAPI = "VAPI",
  ELEVENLABS = "ELEVENLABS",
  SUPABASE = "SUPABASE",
}
