import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatWindow from "./ChatWindow";
import Header from "./Header";
import { useGuestServiceMenu } from "@/constants/guestService";
import type { GuestServiceItem } from "@/constants/guestService";
import type { QuickReply } from "./QuickReplies";
import { useRecoilValue } from "recoil";
import { bookingAtom } from "@/store/booking.recoil";
import { Capitalize } from "@/lib/Capitalize";
import { ITEM_ICON, CATEGORY_ICON, UI_ICON } from "@/constants/icons";

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
  const guestServiceMenu = useGuestServiceMenu();
  // 💬 Message timeline
  const [messages, setMessages] = useState<Message[]>([]);
  // 🔘 Inline quick‑reply chips
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  // 🧭 Navigation state
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const booking = useRecoilValue(bookingAtom);

  console.log(categoryIndex, "categoryIndex");

  const botSend = (text: string, delay = 500) => {
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

  // HOME: featured + "Browse all options"
  const buildHomeReplies = (): QuickReply[] => {
    const featured = getFeaturedItems().map((item) => ({
      label: item.isChargeable ? `${item.label} 💰` : item.label,
      onClick: () => handleItem(item),
      icon: ITEM_ICON[item.type],
    }));

    const extras: QuickReply[] = [
      {
        label: "Explore Services",
        icon: UI_ICON.browse,

        onClick: () => {
          // move to categories view
          setCategoryIndex(null);
          setQuickReplies(buildCategoriesReplies());
          push({ sender: "guest", text: "Browse categories" });
          botSend("Choose a category below 👇");
        },
      },
    ];

    return [...featured, ...extras] as QuickReply[];
  };

  // CATEGORIES: list all categories (not featured)
  const buildCategoriesReplies = (): QuickReply[] => {
    const categories = guestServiceMenu.map((cat, idx) => ({
      label: cat.category,
      icon: CATEGORY_ICON[cat.category], // icon
      onClick: () => handleCategory(idx),
    }));

    const extras: QuickReply[] = [
      {
        label: "Home",
        icon: UI_ICON.home,
        onClick: () => {
          setCategoryIndex(null);
          setQuickReplies(buildHomeReplies());
          push({ sender: "guest", text: "Back to home" });
          botSend("Quick actions below, or pick a category.");
        },
      },
      {
        label: "Didn’t find what I need",
        icon: UI_ICON.help,
        onClick: () =>
          botSend(
            `No worries! Please call reception at ${booking?.property.receptionNo} `
          ),
      },
    ];

    return [...categories, ...extras] as QuickReply[];
  };

  // ITEMS: items inside a category (+ go back)
  const buildItemReplies = (idx: number): QuickReply[] => {
    const replies = guestServiceMenu[idx].items
      .filter((item) => !item.featured)
      .map((item) => ({
        label: item.isChargeable ? `${item.label} 💰` : item.label,
        icon: ITEM_ICON[item.type],
        onClick: () => handleItem(item),
      }));

    const extras: QuickReply[] = [
      {
        label: "Go Back",
        icon: UI_ICON.back,
        onClick: () => {
          setCategoryIndex(null);
          setQuickReplies(buildCategoriesReplies());
          push({ sender: "guest", text: "Go back" });
          botSend("No problem. Please choose a category below 👇");
        },
      },
      {
        label: "Didn’t find what I need",
        icon: UI_ICON.help,
        onClick: () =>
          botSend(
            "Please call reception at 100 or press the Help button on your TV."
          ),
      },
    ];

    return [...replies, ...extras] as QuickReply[];
  };

  const getFeaturedItems = (): GuestServiceItem[] =>
    guestServiceMenu.flatMap((cat) => cat.items.filter((i) => i.featured));

  // const buildFeaturedReplies = (): QuickReply[] => {
  //   console.log("Building featured replies");
  //   const replies = getFeaturedItems().map((item) => ({
  //     label: item.isChargeable ? `${item.label} 💰` : item.label,
  //     onClick: () => handleItem(item),
  //   }));
  //   return [
  //     ...replies,
  //     {
  //       label: "📂 Browse all options",
  //       onClick: () => {
  //         setQuickReplies(buildCategoriesReplies());
  //         push({ sender: "guest", text: "Browse categories" });
  //         botSend("Choose a category below 👇");
  //       },
  //     },
  //   ] as QuickReply[];
  // };

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

  const handleItem = async (item: GuestServiceItem) => {
    push({ sender: "guest", text: item.label });
    console.log("Handling item:", item);
    const maybeReply = await item.action();

    if (typeof maybeReply === "string") {
      botSend(maybeReply);
    } else if (item.reply) {
      botSend(item.reply);
    } else {
      botSend("Thank you for your request! We'll process it shortly.");
    }

    // Optionally clear replies for free‑text follow‑up
    if (item.kind === "CHARGEABLE") {
      item.action();
      setQuickReplies([]);
    } else {
      item.action();
      // After confirmation, offer to choose another category
      setCategoryIndex(null);
      setQuickReplies(buildHomeReplies());
    }

    // TODO: fetch("/api/guest-service", …) here
  };

  /** --------------------------------------------------------------
   * Init – greet + categories on mount
   * --------------------------------------------------------------*/
  useEffect(() => {
    if (messages.length === 0) {
      botSend(
        `Hi ${Capitalize(
          (booking?.guestName.toLowerCase() as string) || "Guest"
        )}! I’m your Zenvana concierge. Quick actions below, or browse categories 👇`,
        0
      );
      setQuickReplies(buildHomeReplies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** --------------------------------------------------------------
   * Render
   * --------------------------------------------------------------*/
  return (
    <div className="h-[100dvh] pb-[env(safe-area-inset-bottom)]">
      <Header />
      <div className="pt-20">
        <Card className="mx-auto w-full max-w-md border-none bg-transparent rounded-none  ">
          <CardContent
            className=" flex h-full flex-col 
    bg-black/70 backdrop-blur-sm  rounded-none min-h-[88vh] w-full px-2"
          >
            {/* bottom glow */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 
      rounded-none bg-gradient-to-t from-violet-700/30 via-transparent to-transparent"
            />

            {/* 🗨 Chat area */}
            <ChatWindow
              messages={messages}
              quickReplies={quickReplies}
              isTyping={isTyping}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
