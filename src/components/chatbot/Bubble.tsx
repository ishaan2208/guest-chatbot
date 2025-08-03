import { cn } from "@/lib/utils";
import ChatAvatar from "./Avatar";
import TypingIndicator from "./TypingIndicator";

export default function Bubble({
  sender,
  text,
}: {
  sender: "bot" | "guest" | "typing";
  text: string;
}) {
  const isGuest = sender === "guest";

  // 👉 Handle typing as a dedicated branch (no tail, no text)
  if (sender === "typing") {
    return (
      <div className="flex w-full gap-2 items-center justify-start">
        <ChatAvatar sender="bot" />
        <div className="max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-md bg-muted text-foreground">
          <TypingIndicator />
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex w-full gap-2 items-center",
        isGuest ? "justify-end" : "justify-start"
      )}
    >
      {sender === "bot" && <ChatAvatar sender="bot" />}

      {/* {sender === "bot" && <ChatAvatar sender="typing" />} */}

      <span
        className={cn(
          "relative max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed shadow-md whitespace-pre-line",
          isGuest ? "bg-violet-600 text-white" : "bg-muted text-foreground",
          // tails
          "after:absolute after:bottom-[-6px] after:w-4 after:h-5  after:content-['']",
          isGuest
            ? "after:right-[0px] after:clip-path-[polygon(100%_0,0_0,0_100%)] after:rounded-bl-[10px]  after:bg-violet-600 "
            : "after:left-[0px] after:bg-muted after:clip-path-[polygon(100%_0,100%_0,100%_100%)] after:rounded-br-[10px]"
        )}
      >
        {text}
      </span>
      {sender === "guest" && <ChatAvatar sender="guest" />}
    </div>
  );
}
