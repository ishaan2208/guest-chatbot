import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import ChatWindow from "./ChatWindow";
import { useGuestServiceMenu } from "@/constants/guestService";
import type { GuestServiceItem } from "@/constants/guestService";
import type { QuickReply } from "./QuickReplies";
import { bookingAtom } from "@/store/booking.recoil";
import { ITEM_ICON, CATEGORY_ICON, UI_ICON } from "@/constants/icons";
import { useGuestProfile } from "@/stores/guestProfile";
import { useChatTyping } from "@/stores/chatTyping";
import { ChatSwipeHandler } from "@/components/mobile/swipe-handler";
import { formatGuestName } from "@/lib/guestName";
import type { WifiCredential } from "./WifiCard";
import type { ServiceTicket } from "./ServiceTicketCard";
import type { ContactInfo } from "./ContactCard";
import { artForType, SERVICE_ART } from "./serviceArt";

// Derived from the art map so restored tickets validate against every
// illustration, new ones included (no drift when the set grows).
const ART_KEYS: ReadonlySet<string> = new Set(Object.keys(SERVICE_ART));

/** ----------------------------------------------------------------
 * 📨 Local message shape
 * ----------------------------------------------------------------*/
interface Message {
  id: string;
  sender: "bot" | "guest";
  text: string;
  /** Optional SLA/time shown under bot reply (e.g. "Within 15 min" or from backend) */
  sla?: string;
  /** When set, the bot message renders the Wi-Fi credential keycard */
  wifi?: WifiCredential;
  /** When set, the bot message renders the service request docket */
  ticket?: ServiceTicket;
  /** When set, the bot message renders the tap-to-call contact card */
  contact?: ContactInfo;
}

/** Which team a request lands with — for the docket subtitle only (presentational). */
const MAINTENANCE_TYPES = new Set([
  "TV_NOT_WORKING", "FLUSH_NOT_WORKING", "AC_NOT_WORKING", "LIGHT_ISSUE",
  "GEYSER_ISSUE", "SOCKET_ISSUE", "FRIDGE_ISSUE", "FAN_ISSUE",
]);
const ROOM_SERVICE_TYPES = new Set(["FOOD_CLEARANCE"]);
const FRONT_DESK_TYPES = new Set(["CHECKOUT_REQUEST", "LOST_KEYCARD"]);

function deriveHandledBy(item: GuestServiceItem): string {
  if (item.handledBy) return item.handledBy;
  if (MAINTENANCE_TYPES.has(item.type)) return "Maintenance";
  if (ROOM_SERVICE_TYPES.has(item.type)) return "Room Service";
  if (FRONT_DESK_TYPES.has(item.type)) return "Front Desk";
  return "Housekeeping";
}

/** The catalog flags chargeable items with a "(₹)" suffix; the card shows a
 *  gold ₹ badge instead, so strip the suffix from the displayed label. */
function cleanLabel(label: string): string {
  return label.replace(/\s*\(₹\)\s*$/, "");
}

/** Short hint shown under an option card's label. */
function itemBlurb(item: GuestServiceItem): string | undefined {
  if (item.type === "WIFI_PASSWORD") return "Network name & password";
  if (item.description) return item.description;
  if (item.kind === "REDIRECT") return "Opens in a new tab";
  if (item.isChargeable) return "Added to your room bill";
  if (item.etaMinutes != null) return `Delivered in ~${item.etaMinutes} min`;
  if (MAINTENANCE_TYPES.has(item.type)) return "We'll send maintenance";
  return "Tap to request";
}

function formatDueAt(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `By ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  } catch {
    return "";
  }
}

const CHAT_STORAGE_KEY_PREFIX = "guest-chatbot-history";
const MAX_STORED_MESSAGES = 200;

function getStorageKey(bookingId: string | number | null | undefined): string {
  return `${CHAT_STORAGE_KEY_PREFIX}-${bookingId ?? "default"}`;
}

function makeMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadChatFromStorage(key: string): { messages: Message[]; categoryIndex: number | null } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { messages: [], categoryIndex: null };
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object" || !Array.isArray((data as { messages?: unknown }).messages))
      return { messages: [], categoryIndex: null };
    const { messages, categoryIndex } = data as { messages: Message[]; categoryIndex?: number | null };
    const list = Array.isArray(messages) ? messages : [];
    const valid = list.filter(
      (m) => m && typeof m.sender === "string" && typeof m.text === "string" && (m.sender === "bot" || m.sender === "guest")
    ).map((m) => {
      const src = m as Message;
      const wifi =
        src.wifi &&
        typeof src.wifi.network === "string" &&
        typeof src.wifi.password === "string"
          ? { network: src.wifi.network, password: src.wifi.password }
          : undefined;
      const t = src.ticket;
      const ticket =
        t && typeof t.title === "string" && typeof t.art === "string" && ART_KEYS.has(t.art) && typeof t.at === "number"
          ? {
              art: t.art,
              title: t.title,
              handledBy: typeof t.handledBy === "string" ? t.handledBy : undefined,
              room: typeof t.room === "string" ? t.room : undefined,
              eta: typeof t.eta === "string" ? t.eta : undefined,
              chargeable: Boolean(t.chargeable),
              free: Boolean(t.free),
              at: t.at,
            }
          : undefined;
      const c = src.contact;
      const contact =
        c && typeof c.title === "string" && typeof c.number === "string"
          ? {
              title: c.title,
              number: c.number,
              note: typeof c.note === "string" ? c.note : undefined,
              tone: c.tone === "urgent" ? ("urgent" as const) : ("default" as const),
            }
          : undefined;
      return {
        id: typeof src.id === "string" ? src.id : makeMessageId(),
        sender: src.sender,
        text: src.text,
        sla: typeof src.sla === "string" ? src.sla : undefined,
        wifi,
        ticket,
        contact,
      };
    });
    const idx = typeof categoryIndex === "number" && Number.isInteger(categoryIndex) ? categoryIndex : null;
    return { messages: valid, categoryIndex: idx };
  } catch {
    return { messages: [], categoryIndex: null };
  }
}

function saveChatToStorage(
  key: string,
  messages: Message[],
  categoryIndex: number | null
): void {
  try {
    const toSave = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(key, JSON.stringify({ messages: toSave, categoryIndex }));
  } catch {
    // ignore quota or parse errors
  }
}

/** ----------------------------------------------------------------
 * 🚀 GuestChatBot – root UI component
 * ----------------------------------------------------------------*/
export default function GuestChatBot() {
  const navigate = useNavigate();
  const guestServiceMenu = useGuestServiceMenu();
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [restoreAttempted, setRestoreAttempted] = useState(false);
  const sentGreetingRef = useRef(false);
  const botTimeoutsRef = useRef<number[]>([]);
  /** Restored history renders static; only messages after this index animate in */
  const restoredCountRef = useRef(0);

  const booking = useRecoilValue(bookingAtom);
  const storageKey = getStorageKey(booking?.id ?? null);
  const setChatTyping = useChatTyping((s) => s.setTyping);

  // Mirror the local typing state to the shared store so the header can show
  // a WhatsApp-style "typing…" while the concierge composes.
  useEffect(() => {
    setChatTyping(isTyping);
  }, [isTyping, setChatTyping]);
  useEffect(() => () => setChatTyping(false), [setChatTyping]);
  const { getContextualGreeting, getRecommendedServices, addServiceToHistory } =
    useGuestProfile();

  const recommendedServiceSet = useMemo(
    () => new Set(getRecommendedServices()),
    [getRecommendedServices]
  );

  const botSend = (text: string, delay = 500, sla?: string) => {
    setIsTyping(true);
    const timeoutId = window.setTimeout(() => {
      push({ sender: "bot", text, sla });
      setIsTyping(false);
    }, delay);
    botTimeoutsRef.current.push(timeoutId);
  };

  const botSendWifi = (text: string, wifi: WifiCredential, delay = 500) => {
    setIsTyping(true);
    const timeoutId = window.setTimeout(() => {
      push({ sender: "bot", text, wifi });
      setIsTyping(false);
    }, delay);
    botTimeoutsRef.current.push(timeoutId);
  };

  const botSendTicket = (text: string, ticket: ServiceTicket, delay = 500) => {
    setIsTyping(true);
    const timeoutId = window.setTimeout(() => {
      push({ sender: "bot", text, ticket });
      setIsTyping(false);
    }, delay);
    botTimeoutsRef.current.push(timeoutId);
  };

  const botSendContact = (text: string, contact: ContactInfo, delay = 500) => {
    setIsTyping(true);
    const timeoutId = window.setTimeout(() => {
      push({ sender: "bot", text, contact });
      setIsTyping(false);
    }, delay);
    botTimeoutsRef.current.push(timeoutId);
  };

  const firstName =
    formatGuestName(booking?.guestName ?? booking?.guest?.name, {
      useFirstName: true,
    }) ?? "";
  const namePart = firstName && firstName !== "Guest" ? `, ${firstName}` : "";

  /** Selected room number for the docket (undefined when unknown / "N/A"). */
  const displayRoom = (() => {
    const rooms = booking?.BookingRoom ?? [];
    const selectedId =
      typeof window !== "undefined" ? localStorage.getItem("roomNumberId") : null;
    const room = selectedId
      ? rooms.find((r) => String(r.id) === selectedId) ?? rooms[0]
      : rooms[0];
    const n = room?.roomNumber;
    return n && n !== "N/A" ? n : undefined;
  })();

  /** --------------------------------------------------------------
   * Utils
   * --------------------------------------------------------------*/
  const push = (msg: Omit<Message, "id">) =>
    setMessages((prev) => [...prev, { id: makeMessageId(), ...msg }]);

  const buildHomeReplies = (): QuickReply[] => {
    const featured = getFeaturedItems().map((item) => ({
      label: cleanLabel(item.tileTitle || item.label),
      blurb: itemBlurb(item),
      chargeable: item.isChargeable,
      free: item.free,
      onClick: () => handleItem(item),
      icon: ITEM_ICON[item.type],
    }));

    const extras: QuickReply[] = [
      {
        label: "Explore all services",
        blurb: "Browse every category",
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
      blurb: cat.description,
      icon: CATEGORY_ICON[cat.category],
      onClick: () => handleCategory(idx),
    }));

    const extras: QuickReply[] = [
      {
        label: "Home",
        icon: UI_ICON.home,
        variant: "utility",
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
        variant: "utility",
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
        label: cleanLabel(item.label),
        blurb: itemBlurb(item),
        chargeable: item.isChargeable,
        free: (item as { free?: boolean }).free,
        icon: ITEM_ICON[item.type],
        onClick: () => handleItem(item),
      }));

    const extras: QuickReply[] = [
      {
        label: "Go back",
        icon: UI_ICON.back,
        variant: "utility",
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
        variant: "utility",
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

    // Yield so the user bubble paints and scroll runs before we block on the API
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    );

    try {
      const maybeReply = await item.action();
      const backendSla = maybeReply && typeof maybeReply === "object" && "slaMinutes" in maybeReply
        ? `Within ${(maybeReply as { slaMinutes: number }).slaMinutes} min`
        : maybeReply && typeof maybeReply === "object" && "dueAt" in maybeReply
          ? formatDueAt((maybeReply as { dueAt: string }).dueAt)
          : undefined;
      const sla = backendSla ?? (item.etaMinutes != null ? `Within ${item.etaMinutes} min` : undefined);

      const replyText =
        (typeof maybeReply === "string" ? maybeReply : item.reply) ??
        "Thank you for your request! We'll process it shortly.";
      const wifiPassword = booking?.property?.wifiPassword;

      if (item.type === "WIFI_PASSWORD" && wifiPassword && wifiPassword !== "Not available") {
        const network = booking?.property?.name || "Guest Wi-Fi";
        botSendWifi(
          `Here you go${namePart} — you're all set. Tap copy and you're online.`,
          { network, password: wifiPassword }
        );
      } else if (item.type === "CALL_RECEPTION") {
        botSendContact("Connecting you to reception — tap to call.", {
          title: "Front Desk",
          number: String(booking?.property?.receptionNo || "100"),
          note: "Reception · available 24 hours",
        });
      } else if (item.type === "EMERGENCY_NUMBER") {
        const property = booking?.property as
          | { emergencyNo?: string | number; receptionNo?: string | number }
          | undefined;
        botSendContact("Help is one tap away. Hotel protocol applies.", {
          title: "Emergency",
          number: String(property?.emergencyNo || property?.receptionNo || "100"),
          note: "Hotel protocol applies",
          tone: "urgent",
        });
      } else if (item.kind === "REDIRECT") {
        // Order food / taxi navigate away — a docket would be orphaned; keep the line.
        botSend(replyText, 500);
      } else {
        // Everything else logged a real ticket → hand the guest a docket receipt.
        botSendTicket(replyText, {
          art: artForType(item.type),
          title: cleanLabel(item.tileTitle || item.label),
          handledBy: deriveHandledBy(item),
          room: displayRoom,
          eta: sla,
          chargeable: item.isChargeable,
          free: item.free,
          at: Date.now(),
        });
      }
    } catch (error) {
      setIsTyping(false);
      push({
        sender: "bot",
        text:
          error instanceof Error && error.message
            ? error.message
            : "Session expired. Please sign in again.",
      });
      setQuickReplies([]);
      setTimeout(() => navigate("/login", { replace: true }), 900);
      return;
    }

    addServiceToHistory(item.type, true);

    if (item.kind === "CHARGEABLE") {
      setQuickReplies(buildHomeReplies());
    } else {
      setCategoryIndex(null);
      setQuickReplies(buildHomeReplies());
    }
  };

  // Restore chat history from localStorage when storage key or menu is ready
  const lastRestoredKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastRestoredKeyRef.current === storageKey || !guestServiceMenu?.length) return;
    const saved = loadChatFromStorage(storageKey);
    if (saved.messages.length > 0) {
      restoredCountRef.current = saved.messages.length;
      setMessages(saved.messages);
      setCategoryIndex(saved.categoryIndex);
      setQuickReplies(
        saved.categoryIndex === null
          ? buildHomeReplies()
          : buildItemReplies(saved.categoryIndex)
      );
    }
    lastRestoredKeyRef.current = storageKey;
    setRestoreAttempted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- buildHomeReplies/buildItemReplies are stable enough; full deps cause loops
  }, [storageKey, guestServiceMenu]);

  // Persist to localStorage when messages or category change
  useEffect(() => {
    saveChatToStorage(storageKey, messages, categoryIndex);
  }, [storageKey, messages, categoryIndex]);

  useEffect(() => {
    return () => {
      for (const timeoutId of botTimeoutsRef.current) {
        clearTimeout(timeoutId);
      }
      botTimeoutsRef.current = [];
    };
  }, []);

  // Initial greeting only after restore attempted and no messages (send once)
  useEffect(() => {
    if (!restoreAttempted || messages.length > 0 || sentGreetingRef.current) return;
    sentGreetingRef.current = true;
    botSend(
      `${getContextualGreeting()} I’m your Zenvana concierge. Quick actions below, or browse categories 👇`,
      0
    );
    setQuickReplies(buildHomeReplies());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional narrow deps; full deps would re-send greeting
  }, [restoreAttempted]);

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
      <div className="mx-auto flex h-full w-full max-w-md flex-col min-h-0">
        <ChatWindow
          messages={messages}
          quickReplies={quickReplies}
          isTyping={isTyping}
          staticCount={restoredCountRef.current}
        />
      </div>
    </ChatSwipeHandler>
  );
}
