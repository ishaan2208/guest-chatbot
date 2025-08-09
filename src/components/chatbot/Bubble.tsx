import { cn } from "@/lib/utils";
import ChatAvatar from "./Avatar";
import TypingIndicator from "./TypingIndicator";
import { motion } from "framer-motion";

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
        <div className="max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-md dark:bg-slate-800 text-foreground">
          <TypingIndicator />
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
            isGuest
              ? "bg-gradient-to-tr from-fuchsia-700/60 via-violet-700 to-violet-700 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              : "bg-white dark:bg-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
            // tails
            "after:absolute after:bottom-[-6px] after:w-4 after:h-5  after:content-['']",
            isGuest
              ? "after:right-[0px] after:clip-path-[polygon(100%_0,0_0,0_100%)] after:rounded-bl-[10px]  after:bg-violet-700 "
              : "after:left-[0px] dark:after:bg-slate-800 after:bg-white  after:clip-path-[polygon(100%_0,100%_0,100%_100%)] after:rounded-br-[10px]"
          )}
        >
          {text}
        </span>
        {sender === "guest" && <ChatAvatar sender="guest" />}
      </div>
    </motion.div>
  );
}
