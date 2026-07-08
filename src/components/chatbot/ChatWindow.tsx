import type { FC } from "react";
import { useEffect, useRef } from "react";
import Bubble from "./Bubble";
import QuickReplies from "./QuickReplies";
import type { QuickReply } from "./QuickReplies";
import type { WifiCredential } from "./WifiCard";
import type { ServiceTicket } from "./ServiceTicketCard";
import type { ContactInfo } from "./ContactCard";

interface Message {
  id: string;
  sender: "bot" | "guest";
  text: string;
  sla?: string;
  wifi?: WifiCredential;
  ticket?: ServiceTicket;
  contact?: ContactInfo;
}

interface ChatWindowProps {
  messages: Message[];
  quickReplies: QuickReply[];
  isTyping: boolean;
  /** Messages at index < staticCount render without an entrance animation (restored history) */
  staticCount?: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Transcript on top, chip dock below — the dock is the composer:
 * it never scrolls away, the way a keyboard wouldn't.
 */
const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  quickReplies,
  isTyping,
  staticCount = 0,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    const toBottom = (behavior: ScrollBehavior) => {
      const el = scrollerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    };
    const id = requestAnimationFrame(() =>
      toBottom(prefersReducedMotion() ? "auto" : "smooth")
    );
    // The chip dock mounts/unmounts and resizes this scroller, which can kill
    // an in-flight smooth scroll — pin the bottom instantly once layout settles.
    const t = window.setTimeout(() => toBottom("auto"), 320);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [messages, isTyping, quickReplies]);

  // Stay pinned when the scroller itself resizes (browser chrome collapsing,
  // the dock growing) — but only if the reader was already at the bottom.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let lastNearBottom = true;
    const ro = new ResizeObserver(() => {
      if (lastNearBottom) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    });
    const onScroll = () => {
      lastNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={scrollerRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the concierge"
        className="chat-scroll flex min-h-0 flex-1 flex-col"
      >
        {/* Natural top-down flow: greeting at the top; the option cards live
            inline at the end of the transcript and scroll with it — not pinned
            to the bottom, so the chat gets the full height to breathe. */}
        <div className="space-y-2.5 px-1 pt-4 pb-6">
          {messages.map((msg, i) => (
            <Bubble
              key={msg.id}
              sender={msg.sender}
              text={msg.text}
              sla={msg.sla}
              wifi={msg.wifi}
              ticket={msg.ticket}
              contact={msg.contact}
              groupStart={i === 0 || messages[i - 1].sender !== msg.sender}
              animate={i >= staticCount}
            />
          ))}
          {isTyping && <Bubble sender="typing" text="" />}
          {quickReplies.length > 0 && !isTyping && (
            <div className="pt-1">
              <QuickReplies replies={quickReplies} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
