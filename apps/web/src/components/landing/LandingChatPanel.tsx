import { useEffect, useRef, useState } from "react";
import { Calendar, LoaderCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useChatSession } from "@/hooks/use-chat-session";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLandingExperience } from "@/components/landing/landing-experience";

function hasBookingIntent(text: string) {
  return /(book|booking|appointment|schedule|visit|slot|confirm)/i.test(text);
}

interface LandingChatPanelProps {
  className?: string;
  greeting: string;
  inputPlaceholder: string;
  bookingCtaLabel: string;
  bodyClassName?: string;
}

export function LandingChatPanel({
  className,
  greeting,
  inputPlaceholder,
  bookingCtaLabel,
  bodyClassName,
}: LandingChatPanelProps) {
  const { language } = useI18n();
  const { scrollToBooking } = useLandingExperience();
  const { chatTranscript, send, isSending, error } = useChatSession(language);
  const [inputValue, setInputValue] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);

  const visibleMessages = chatTranscript.length
    ? chatTranscript
    : [
        {
          id: "landing-greeting",
          role: "ai" as const,
          text: greeting,
          createdAt: "",
        },
      ];
  const shouldShowBookingCta = visibleMessages.some(
    (message) => message.role === "ai" && hasBookingIntent(message.text),
  );

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await send(inputValue);
    if (!result) {
      return;
    }

    setInputValue("");
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        ref={transcriptRef}
        className={cn("space-y-3 overflow-y-auto p-4", bodyClassName)}
      >
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                message.role === "user"
                  ? "rounded-tr-sm bg-gradient-primary text-primary-foreground"
                  : "rounded-tl-sm bg-slate-100 text-slate-700",
              )}
            >
              {message.text}
              {message.role === "ai" &&
              visibleMessages[visibleMessages.length - 1]?.id === message.id &&
              shouldShowBookingCta ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full bg-white text-slate-700 hover:bg-slate-50"
                  onClick={scrollToBooking}
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  {bookingCtaLabel}
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <p className="px-4 pb-2 text-xs text-rose-500">{error.message}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
          placeholder={inputPlaceholder}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          disabled={isSending || !inputValue.trim()}
        >
          {isSending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
