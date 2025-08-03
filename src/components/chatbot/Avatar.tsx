import type { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
// If you have shadcn's cn() util; otherwise use clsx or template strings
import { cn } from "@/lib/utils";

type Sender = "bot" | "guest" | "typing";

interface ChatAvatarProps {
  sender: Sender;
  /** Show a photo when available (guest selfie or hotel logo for bot) */
  src?: string;
  /** Used for initials if no src (e.g., "Shivham") */
  name?: string;
  /** Green presence dot */
  online?: boolean;
  /** Avatar size */
  size?: "sm" | "md" | "lg";
  /** Round ring accent around avatar */
  ring?: boolean;
}

const sizeMap: Record<NonNullable<ChatAvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-[12px]",
  md: "h-9 w-9 text-[12px]",
  lg: "h-10 w-10 text-[13px]",
};

function nameToInitials(name?: string) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0];
  const second = parts[1]?.[0];
  return (first ?? "").concat(second ?? "").toUpperCase() || "•";
}

const ChatAvatar: FC<ChatAvatarProps> = ({
  sender,
  src,
  name,
  online = false,
  size = "md",
  ring = true,
}) => {
  const isBot = sender === "bot";

  return (
    <div className="relative inline-flex">
      <Avatar
        className={cn(
          sizeMap[size],
          "shrink-0",
          ring && "ring-1 ring-black/10 dark:ring-white/15"
        )}
        aria-label={isBot ? "Zenvana Concierge" : name || "Guest"}
      >
        {src ? (
          <AvatarImage src={src} alt={name || sender} />
        ) : (
          <AvatarFallback
            className={cn(
              "flex items-center justify-center font-medium",
              isBot
                ? // ✨ Concierge / bot look: branded gradient
                  "text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600"
                : // 👤 Guest look: soft neutral chip
                  "bg-muted text-foreground"
            )}
          >
            {isBot ? (
              // Clean vector icon beats an emoji here
              <Bot className="h-4 w-4" aria-hidden="true" />
            ) : // Prefer initials if we know the guest name; else a user icon
            name ? (
              <span>{nameToInitials(name)}</span>
            ) : (
              <User className="h-4 w-4" aria-hidden="true" />
            )}
          </AvatarFallback>
        )}
      </Avatar>

      {online && (
        <span
          className="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ChatAvatar;
