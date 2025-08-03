import type { FC } from "react";
import ChatAvatar from "./Avatar";
import TypingIndicator from "./TypingIndicator";

interface BubbleProps {
  sender: "bot" | "guest" | "typing";
  text?: string;
}

const Bubble: FC<BubbleProps> = ({ sender, text }) => {
  if (sender === "typing") return <TypingIndicator />;
  return (
    <div
      className={`flex w-full gap-2 ${
        sender === "guest" ? "justify-end" : "justify-start"
      }`}
    >
      {sender === "bot" && <ChatAvatar sender="bot" />}
      <span
        className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed shadow-md whitespace-pre-line
      ${
        sender === "guest"
          ? "bg-violet-600 text-white"
          : "bg-gray-200 text-gray-900"
      }`}
      >
        {text}
      </span>
      {sender === "guest" && <ChatAvatar sender="guest" />}
    </div>
  );
};

export default Bubble;
