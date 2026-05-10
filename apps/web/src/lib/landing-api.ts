import { apiRequest } from "@/lib/api-client";

export type BookingServiceKey =
  | "whitening"
  | "implants"
  | "invisalign"
  | "cleaning"
  | "emergency";

export const BOOKING_SERVICE_CONFIG: Record<
  BookingServiceKey,
  { label: string; durationMinutes: number }
> = {
  whitening: { label: "Teeth Whitening", durationMinutes: 45 },
  implants: { label: "Dental Implants", durationMinutes: 60 },
  invisalign: { label: "Invisalign", durationMinutes: 45 },
  cleaning: { label: "General Dentistry", durationMinutes: 30 },
  emergency: { label: "Emergency Care", durationMinutes: 30 },
};

export interface CreateLeadInput {
  fullName: string;
  phone: string;
  whatsappNumber: string;
  source: "WEBSITE" | "CHATBOT";
  inquiryType?: string;
  serviceInterest?: string;
  message?: string;
  preferredLanguage?: string;
}

export interface LeadRecord {
  id: string;
  fullName: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
  source: string;
  status: string;
}

export interface CreateAppointmentInput {
  patientName: string;
  patientPhone: string;
  leadId?: string;
  serviceName?: string;
  source: "WEBSITE" | "CHATBOT";
  startAt: string;
  endAt: string;
  reasonForVisit?: string;
  timezone?: string;
  confirmationChannel?: "WHATSAPP";
}

export interface AppointmentRecord {
  id: string;
  status: string;
  startAt: string;
  endAt: string;
  patient?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
}

export interface StartChatSessionInput {
  patientName?: string;
  phone?: string;
  leadId?: string;
  channel?: "WEB_CHAT";
}

export interface ChatTranscriptMessage {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

export interface ChatSessionRecord {
  id: string;
  status: string;
  patientName?: string;
  phone?: string;
  leadId?: string;
  channel: string;
  messages: ChatTranscriptMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatReplyRecord {
  sessionId: string;
  reply: string;
  messages: ChatTranscriptMessage[];
}

export interface SendChatMessageInput {
  sessionId: string;
  message: string;
  language?: string;
}

export async function createLead(input: CreateLeadInput) {
  const result = await apiRequest<LeadRecord>("/api/v1/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return result;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const result = await apiRequest<AppointmentRecord>("/api/v1/appointments", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return result;
}

export async function startChatSession(input: StartChatSessionInput) {
  const result = await apiRequest<ChatSessionRecord>("/api/v1/chatbot/session/start", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return result;
}

export async function sendChatMessage(input: SendChatMessageInput) {
  const result = await apiRequest<ChatReplyRecord>("/api/v1/chatbot/message", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return result;
}

export async function getChatSession(sessionId: string) {
  const result = await apiRequest<ChatSessionRecord>(`/api/v1/chatbot/session/${sessionId}`, {
    method: "GET",
  });

  return result;
}
