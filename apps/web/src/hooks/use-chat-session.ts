import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getChatSession,
  sendChatMessage,
  startChatSession,
  type BookingServiceKey,
  type ChatTranscriptMessage,
} from "@/lib/landing-api";
import {
  useLandingExperience,
  type LandingChatMessage,
} from "@/components/landing/landing-experience";

function normalizeTranscript(messages: ChatTranscriptMessage[]) {
  return messages.map((message, index) => ({
    id: `${message.createdAt}-${index}`,
    role: message.role === "assistant" ? "ai" : "user",
    text: message.text,
    createdAt: message.createdAt,
  })) satisfies LandingChatMessage[];
}

function extractPhone(text: string) {
  const match = text.match(/(\+?\d[\d\s()-]{7,}\d)/);
  return match?.[1]?.trim() ?? null;
}

function extractName(text: string) {
  const match = text.match(
    /\b(?:my name is|i am|i'm|this is)\s+([a-z][a-z' -]{1,48})/i,
  );
  return match?.[1]
    ?.trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (value) => value.toUpperCase()) ?? null;
}

function extractServiceKey(text: string): BookingServiceKey | null {
  const normalized = text.toLowerCase();

  if (/(whitening|bleach|brighten)/.test(normalized)) return "whitening";
  if (/(implant|missing tooth|missing teeth)/.test(normalized)) return "implants";
  if (/(invisalign|aligner|braces)/.test(normalized)) return "invisalign";
  if (/(cleaning|checkup|check-up|general)/.test(normalized)) return "cleaning";
  if (/(emergency|urgent|pain|broken tooth|swelling)/.test(normalized))
    return "emergency";

  return null;
}

function hasBookingIntent(text: string) {
  return /(book|booking|appointment|schedule|visit|slot|confirm)/i.test(text);
}

export function useChatSession(language: string) {
  const {
    bookingDraft,
    setBookingDraft,
    activeChatSessionId,
    setActiveChatSessionId,
    chatTranscript,
    setChatTranscript,
    needsChatResume,
    markChatResumeHandled,
    resetChat,
  } = useLandingExperience();

  const resumeSessionQuery = useQuery({
    queryKey: ["landing-chat-session", activeChatSessionId],
    queryFn: async () => getChatSession(activeChatSessionId!),
    enabled: Boolean(activeChatSessionId) && needsChatResume,
    staleTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!resumeSessionQuery.data || !needsChatResume) {
      return;
    }

    setChatTranscript(normalizeTranscript(resumeSessionQuery.data.data.messages));
    if (resumeSessionQuery.data.data.patientName && !bookingDraft.fullName) {
      setBookingDraft({ fullName: resumeSessionQuery.data.data.patientName });
    }
    if (resumeSessionQuery.data.data.phone && !bookingDraft.phone) {
      setBookingDraft({ phone: resumeSessionQuery.data.data.phone });
    }
    markChatResumeHandled();
  }, [
    bookingDraft.fullName,
    bookingDraft.phone,
    markChatResumeHandled,
    needsChatResume,
    resumeSessionQuery.data,
    setBookingDraft,
    setChatTranscript,
  ]);

  useEffect(() => {
    if (!needsChatResume) {
      return;
    }

    if (resumeSessionQuery.isError) {
      markChatResumeHandled();
    }
  }, [markChatResumeHandled, needsChatResume, resumeSessionQuery.isError]);

  const startSessionMutation = useMutation({
    mutationFn: async (input: {
      patientName?: string;
      phone?: string;
      leadId?: string;
      channel: "WEB_CHAT";
    }) => startChatSession(input),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (input: { sessionId: string; message: string; language: string }) =>
      sendChatMessage(input),
  });

  async function send(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return null;
    }

    const extractedName = extractName(trimmedMessage);
    const extractedPhone = extractPhone(trimmedMessage);
    const extractedServiceKey = extractServiceKey(trimmedMessage);

    if (extractedName && !bookingDraft.fullName) {
      setBookingDraft({ fullName: extractedName });
    }
    if (extractedPhone && !bookingDraft.phone) {
      setBookingDraft({ phone: extractedPhone });
    }
    if (extractedServiceKey) {
      setBookingDraft({ serviceKey: extractedServiceKey });
    }

    let sessionId = activeChatSessionId;

    if (!sessionId) {
      const sessionResult = await startSessionMutation.mutateAsync({
        patientName: extractedName ?? bookingDraft.fullName ?? undefined,
        phone: extractedPhone ?? bookingDraft.phone ?? undefined,
        channel: "WEB_CHAT",
      });
      sessionId = sessionResult.data.id;
      setActiveChatSessionId(sessionId);
    }

    const messageResult = await sendMessageMutation.mutateAsync({
      sessionId,
      message: trimmedMessage,
      language,
    });

    setChatTranscript(normalizeTranscript(messageResult.data.messages));

    return {
      hasBookingIntent:
        hasBookingIntent(trimmedMessage) || hasBookingIntent(messageResult.data.reply),
    };
  }

  return {
    activeChatSessionId,
    chatTranscript,
    send,
    resetChat,
    isSending:
      startSessionMutation.isPending ||
      sendMessageMutation.isPending ||
      resumeSessionQuery.isPending,
    error:
      (sendMessageMutation.error as Error | null) ??
      (startSessionMutation.error as Error | null) ??
      (resumeSessionQuery.error as Error | null) ??
      null,
  };
}
