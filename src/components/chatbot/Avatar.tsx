import type { FC } from "react";
import { cn } from "@/lib/utils";

type Sender = "bot" | "guest" | "typing";

interface ChatAvatarProps {
  sender: Sender;
  /** Used for initials on the guest side (e.g. "Shivham") */
  name?: string;
  /** Avatar size */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<NonNullable<ChatAvatarProps["size"]>, string> = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

function nameToInitials(name?: string) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0];
  const second = parts[1]?.[0];
  return (first ?? "").concat(second ?? "").toUpperCase() || "•";
}

/**
 * Brand mark avatar. The bot mark is drawn in CSS/SVG (midnight disc, spring Z)
 * so no image ever loads on the chat path.
 */
const ChatAvatar: FC<ChatAvatarProps> = ({ sender, name, size = "md", className }) => {
  const isBot = sender !== "guest";

  return (
    <span
      role="img"
      aria-label={isBot ? "Zenvana concierge" : name || "You"}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full",
        sizeMap[size],
        isBot
          ? "bg-primary text-accent dark:text-primary-foreground"
          : "bg-secondary text-foreground text-[12px] font-semibold",
        className
      )}
    >
      {isBot ? (
        <svg viewBox="0 0 48 48" className="h-[55%] w-[55%]" aria-hidden="true">
          <path
            d="M12 13h24L12 35h24"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span>{nameToInitials(name)}</span>
      )}
    </span>
  );
};

export default ChatAvatar;
