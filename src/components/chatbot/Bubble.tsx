import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatAvatar from "./Avatar";
import TypingIndicator from "./TypingIndicator";
import WifiCard, { type WifiCredential } from "./WifiCard";
import ServiceTicketCard, { type ServiceTicket } from "./ServiceTicketCard";
import ContactCard, { type ContactInfo } from "./ContactCard";

interface BubbleProps {
  sender: "bot" | "guest" | "typing";
  text: string;
  /** Optional SLA/receipt line under a bot reply (e.g. "Within 15 min") */
  sla?: string;
  /** When present, the bot message renders the Wi-Fi keycard */
  wifi?: WifiCredential;
  /** When present, the bot message renders the service request docket */
  ticket?: ServiceTicket;
  /** When present, the bot message renders the tap-to-call contact card */
  contact?: ContactInfo;
  /** First message of a same-sender group: shows the avatar and the accent corner */
  groupStart?: boolean;
  /** New messages slide in; restored history renders static */
  animate?: boolean;
}

/**
 * One chat message. Entrance is a one-shot CSS animation (transform/opacity
 * only) so a 200-message transcript stays plain DOM — no per-bubble JS.
 * A bot message may carry one rich card (wifi / ticket / contact) below its text.
 */
export default function Bubble({
  sender,
  text,
  sla,
  wifi,
  ticket,
  contact,
  groupStart = true,
  animate = true,
}: BubbleProps) {
  const isGuest = sender === "guest";
  const isTyping = sender === "typing";
  const hasCard = Boolean(wifi || ticket || contact);

  if (isGuest) {
    return (
      <div
        className={cn(
          "flex w-full justify-end",
          animate && "animate-msg-in",
          !groupStart && "-mt-1"
        )}
      >
        <span
          className={cn(
            "max-w-[80%] whitespace-pre-line rounded-[1.25rem] bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-primary-foreground",
            groupStart && "rounded-tr-[0.375rem]"
          )}
        >
          {text}
        </span>
      </div>
    );
  }

  const showAvatar = groupStart || isTyping;
  const bubbleChrome =
    "rounded-[1.25rem] border border-border/60 bg-card px-4 py-2.5 text-[15px] leading-relaxed text-card-foreground shadow-(--shadow-bubble)";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2",
        animate && "animate-msg-in",
        !groupStart && "-mt-1"
      )}
    >
      {showAvatar ? (
        <ChatAvatar sender="bot" size="sm" className="mt-0.5" />
      ) : (
        <span aria-hidden="true" className="w-7 shrink-0" />
      )}

      <div
        className={cn(
          "flex min-w-0 flex-col gap-2",
          hasCard ? "w-full max-w-[20rem]" : "max-w-[80%]"
        )}
      >
        {isTyping ? (
          <span className={cn(bubbleChrome, "rounded-tl-[0.375rem]")}>
            <TypingIndicator />
          </span>
        ) : (
          <>
            {text && (
              <span className={cn(bubbleChrome, showAvatar && "rounded-tl-[0.375rem]")}>
                <span className="block whitespace-pre-line">{text}</span>
                {sla && !hasCard && (
                  <span className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2 text-[12.5px] font-medium tabular-nums text-success">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {sla}
                  </span>
                )}
              </span>
            )}
            {hasCard && (
              <div
                className={cn(animate && "animate-bloom")}
                style={animate ? { animationDelay: "0.26s" } : undefined}
              >
                {wifi && <WifiCard network={wifi.network} password={wifi.password} />}
                {ticket && <ServiceTicketCard {...ticket} />}
                {contact && <ContactCard {...contact} />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
