import type { FC } from "react";
import { useEffect, useRef } from "react";
import Bubble from "./Bubble";
import QuickReplies from "./QuickReplies";
import type { QuickReply } from "./QuickReplies";

interface Message {
  sender: "bot" | "guest";
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  quickReplies: QuickReply[];
  isTyping: boolean;
}

const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  quickReplies,
  isTyping,
}) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quickReplies]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
      {messages.map((msg, idx) => (
        <Bubble key={idx} sender={msg.sender} text={msg.text} />
      ))}
      {isTyping && <Bubble sender="typing" />}
      {quickReplies.length > 0 && <QuickReplies replies={quickReplies} />}

      {/* Scroll anchor to ensure we always scroll to the bottom */}
      <div ref={endRef} />
    </div>
  );
};

export default ChatWindow;
