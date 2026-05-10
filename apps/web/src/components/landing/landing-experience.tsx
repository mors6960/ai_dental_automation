import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { BookingServiceKey } from "@/lib/landing-api";

const STORAGE_KEY = "lumiere-landing-experience";

export interface LandingChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  createdAt: string;
}

interface BookingDraft {
  fullName: string;
  phone: string;
  serviceKey: BookingServiceKey;
}

interface PersistedLandingExperience {
  bookingDraft: BookingDraft;
  activeChatSessionId: string | null;
  chatTranscript: LandingChatMessage[];
}

interface LandingExperienceContextValue {
  bookingDraft: BookingDraft;
  setBookingDraft: (updates: Partial<BookingDraft>) => void;
  activeChatSessionId: string | null;
  setActiveChatSessionId: (sessionId: string | null) => void;
  chatTranscript: LandingChatMessage[];
  setChatTranscript: (messages: LandingChatMessage[]) => void;
  resetChat: () => void;
  needsChatResume: boolean;
  markChatResumeHandled: () => void;
  scrollToBooking: () => void;
}

const defaultBookingDraft: BookingDraft = {
  fullName: "",
  phone: "",
  serviceKey: "whitening",
};

const LandingExperienceContext =
  createContext<LandingExperienceContextValue | null>(null);

function readPersistedExperience(): PersistedLandingExperience | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PersistedLandingExperience;
  } catch {
    return null;
  }
}

export function LandingExperienceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bookingDraft, setBookingDraftState] =
    useState<BookingDraft>(defaultBookingDraft);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(
    null,
  );
  const [chatTranscript, setChatTranscript] = useState<LandingChatMessage[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [needsChatResume, setNeedsChatResume] = useState(false);

  useEffect(() => {
    const persisted = readPersistedExperience();
    if (persisted) {
      setBookingDraftState({
        ...defaultBookingDraft,
        ...persisted.bookingDraft,
      });
      setActiveChatSessionId(persisted.activeChatSessionId);
      setChatTranscript(persisted.chatTranscript ?? []);
      setNeedsChatResume(Boolean(persisted.activeChatSessionId));
    }
    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bookingDraft,
        activeChatSessionId,
        chatTranscript,
      } satisfies PersistedLandingExperience),
    );
  }, [activeChatSessionId, bookingDraft, chatTranscript, hasLoadedStorage]);

  function setBookingDraft(updates: Partial<BookingDraft>) {
    setBookingDraftState((current) => ({
      ...current,
      ...updates,
    }));
  }

  function resetChat() {
    setActiveChatSessionId(null);
    setChatTranscript([]);
    setNeedsChatResume(false);
  }

  function markChatResumeHandled() {
    setNeedsChatResume(false);
  }

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <LandingExperienceContext.Provider
      value={{
        bookingDraft,
        setBookingDraft,
        activeChatSessionId,
        setActiveChatSessionId,
        chatTranscript,
        setChatTranscript,
        resetChat,
        needsChatResume,
        markChatResumeHandled,
        scrollToBooking,
      }}
    >
      {children}
    </LandingExperienceContext.Provider>
  );
}

export function useLandingExperience() {
  const context = useContext(LandingExperienceContext);
  if (!context) {
    throw new Error(
      "useLandingExperience must be used within LandingExperienceProvider",
    );
  }

  return context;
}
