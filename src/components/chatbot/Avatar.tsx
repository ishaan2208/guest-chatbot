import type { FC } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatAvatarProps {
  sender: "bot" | "guest";
}

const ChatAvatar: FC<ChatAvatarProps> = ({ sender }) => (
  <Avatar className="h-8 w-8 border">
    {sender === "bot" ? (
      <AvatarFallback className="text-xs">🤖</AvatarFallback>
    ) : (
      <AvatarFallback className="text-xs">🧑</AvatarFallback>
    )}
  </Avatar>
);

export default ChatAvatar;
