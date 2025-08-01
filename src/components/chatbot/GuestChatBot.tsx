import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatWindow from "./ChatWindow";
import Header from "./Header";
// 🔑  Ensure the file name matches exactly → guestService.ts (NO typo!)
import { guestServiceMenu } from "@/constants/guetsService";
import type { GuestServiceItem } from "@/constants/guetsService";
import type { QuickReply } from "./QuickReplies";

/** ----------------------------------------------------------------
 * 📨 Local message shape
 * ----------------------------------------------------------------*/
interface Message {
  sender: "bot" | "guest";
  text: string;
}

/** ----------------------------------------------------------------
 * 🚀 GuestChatBot – root UI component
 * ----------------------------------------------------------------*/
export default function GuestChatBot() {
  // 💬 Message timeline
  const [messages, setMessages] = useState<Message[]>([]);
  // 🔘 Inline quick‑reply chips
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  // 🧭 Navigation state
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const botSend = (text: string, delay = 2000) => {
    setIsTyping(true);
    setTimeout(() => {
      push({ sender: "bot", text });
      setIsTyping(false);
    }, delay);
  };

  /** --------------------------------------------------------------
   * Utils
   * --------------------------------------------------------------*/
  const push = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const buildCategoryReplies = (): QuickReply[] => {
    return guestServiceMenu.map((cat, idx) => ({
      label: cat.category,
      onClick: () => handleCategory(idx),
    }));
  };

  const buildItemReplies = (idx: number): QuickReply[] => {
    const replies = guestServiceMenu[idx].items.map((item) => ({
      label: item.label,
      onClick: () => handleItem(item),
    }));
    // Add "Go back" option if not already at the top level
    if (categoryIndex !== null) {
      replies.push({
        //@ts-ignore
        label: "Go back",
        onClick: () => {
          setCategoryIndex(null);
          setQuickReplies(buildCategoryReplies());
          push({ sender: "guest", text: "Go back to categories" });
          botSend("Sure! Please choose a category below 👇");
        },
      });
    }
    return replies;
  };

  /** --------------------------------------------------------------
   * Actions
   * --------------------------------------------------------------*/
  const handleCategory = (idx: number) => {
    setCategoryIndex(idx);
    setQuickReplies(buildItemReplies(idx));

    push({ sender: "guest", text: guestServiceMenu[idx].category });
    botSend(
      `Great! Please pick a service in "${guestServiceMenu[idx].category}"`
    );
  };

  const handleItem = (item: GuestServiceItem) => {
    push({ sender: "guest", text: item.label });
    botSend(item.reply);

    // Optionally clear replies for free‑text follow‑up
    if (item.kind === "COMPLAINT") {
      setQuickReplies([]);
    } else {
      // After confirmation, offer to choose another category
      setCategoryIndex(null);
      setQuickReplies(buildCategoryReplies());
    }

    // TODO: fetch("/api/guest-service", …) here
  };

  /** --------------------------------------------------------------
   * Init – greet + categories on mount
   * --------------------------------------------------------------*/
  useEffect(() => {
    // Greet only once
    if (messages.length === 0) {
      botSend(
        "Hi! I’m your DreamsMoon concierge. Tap a category below to get started 👇",
        0
      );
      setQuickReplies(buildCategoryReplies());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** --------------------------------------------------------------
   * Render
   * --------------------------------------------------------------*/
  return (
    <Card className="mx-auto w-full max-w-md bg-transparent border-none">
      <CardContent className="flex h-full flex-col p-4">
        <Header />

        {/* 🗨 Chat area */}
        <ChatWindow
          messages={messages}
          quickReplies={quickReplies}
          isTyping={isTyping}
        />
      </CardContent>
    </Card>
  );
}
