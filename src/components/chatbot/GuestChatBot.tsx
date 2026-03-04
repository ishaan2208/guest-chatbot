import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import ChatWindow from "./ChatWindow";
import { useGuestServiceMenu } from "@/constants/guestService";
import type { GuestServiceItem } from "@/constants/guestService";
import type { QuickReply } from "./QuickReplies";
import { bookingAtom } from "@/store/booking.recoil";
import { Capitalize } from "@/lib/Capitalize";
import { ITEM_ICON, CATEGORY_ICON, UI_ICON } from "@/constants/icons";
import { useGuestProfile } from "@/stores/guestProfile";
import { ChatSwipeHandler } from "@/components/mobile/swipe-handler";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const booking = useRecoilValue(bookingAtom);
  const { getContextualGreeting, getRecommendedServices, addServiceToHistory } =
    useGuestProfile();

  const recommendedServiceSet = useMemo(
    () => new Set(getRecommendedServices()),
    [getRecommendedServices]
  );

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
          setCategoryIndex(null);
          setQuickReplies(buildCategoriesReplies());
          push({ sender: "guest", text: "Browse categories" });
          botSend("Choose a category below 👇");
        },
      },
    ];

    return [...featured, ...extras] as QuickReply[];
  };

  const buildCategoriesReplies = (): QuickReply[] => {
    const categories = guestServiceMenu.map((cat, idx) => ({
      label: cat.category,
      icon: CATEGORY_ICON[cat.category],
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
            `No worries! Please call reception at ${booking?.property?.receptionNo ?? "100"
            }`
          ),
      },
    ];

    return [...categories, ...extras] as QuickReply[];
  };

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
    guestServiceMenu.flatMap((cat) =>
      cat.items.filter((i) => i.featured || recommendedServiceSet.has(i.type))
    );

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
    setIsTyping(true);

    const maybeReply = await item.action();

    if (typeof maybeReply === "string") {
      botSend(maybeReply);
    } else if (item.reply) {
      botSend(item.reply);
    } else {
      botSend("Thank you for your request! We'll process it shortly.");
    }

    addServiceToHistory(item.type, true);

    if (item.kind === "CHARGEABLE") {
      setQuickReplies(buildHomeReplies());
    } else {
      setCategoryIndex(null);
      setQuickReplies(buildHomeReplies());
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      botSend(
        `${getContextualGreeting()} ${Capitalize(
          (booking?.guestName.toLowerCase() as string) || "Guest"
        )}! I’m your Zenvana concierge. Quick actions below, or browse categories 👇`,
        0
      );
      setQuickReplies(buildHomeReplies());
    }
  }, [booking?.guestName]); // intentional narrow dependency

  const onRefresh = () => {
    setQuickReplies(buildHomeReplies());
    botSend("Refreshed. Here are your latest quick actions.");
  };

  const onBack = () => {
    if (categoryIndex !== null) {
      setCategoryIndex(null);
      setQuickReplies(buildCategoriesReplies());
      botSend("Back to categories.");
    }
  };

  return (
    <ChatSwipeHandler onBack={onBack} canGoBack={categoryIndex !== null} onRefresh={onRefresh}>
      <Card
        className="mx-auto mt-2 flex h-full w-full max-w-md flex-col border-0 bg-transparent shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)] supports-backdrop-filter:backdrop-blur-2xl min-h-0"
      >
        <CardContent className="flex min-h-0 flex-1 w-full flex-col px-2 sm:px-3 ">
          <ChatWindow
            messages={messages}
            quickReplies={quickReplies}
            isTyping={isTyping}
          />
        </CardContent>

        <AnimatePresence>
          {categoryIndex === null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-4 pb-3 text-center text-xs text-muted-foreground shrink-0"
            >
              <div className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Magical mode enabled: contextual recommendations active
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </ChatSwipeHandler>
  );
}
