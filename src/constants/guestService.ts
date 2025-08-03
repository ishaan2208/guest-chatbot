import { Capitalize } from "@/lib/Capitalize";
import { bookingAtom } from "@/store/booking.recoil";
import { useRecoilValue } from "recoil";

export function useGuestServiceMenu() {
  const booking = useRecoilValue(bookingAtom);

  // lightweight personalization
  const firstName = Capitalize(
    booking?.guestName?.split(" ")?.[0].toLowerCase() ||
      booking?.guest?.name?.split(" ")?.[0].toLowerCase() ||
      "Guest"
  );
  const roomNo =
    (typeof window !== "undefined" && localStorage.getItem("roomNumber")) ||
    booking?.BookingRoom?.[0]?.roomNumber ||
    "your room";
  const wifiPass = booking?.property?.wifiPassword ?? "Not available";

  return [
    {
      category: "Housekeeping & Essentials",
      description: "Towels, water, toiletries, cleaning",
      items: [
        {
          type: "WIFI_PASSWORD",
          label: "Wi-Fi password",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          reply: `📶 Hey ${firstName}, Wi-Fi pass: ${wifiPass}`,
          action: () => null, // reply handles content
        },
        {
          type: "EXTRA_TOWELS",
          label: "More towels",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          reply: `🧺 On it! Towels to ${roomNo}.`,
          action: () => sendRequest("TOWELS"),
        },
        {
          type: "WATER_REFILL",
          label: "Water top-up",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          reply: `💧 Water coming to ${roomNo}.`,
          action: () => sendRequest("WATER"),
        },
        {
          type: "ROOM_CLEANING",
          label: "Clean my room",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧹 Noted. Housekeeping will come shortly.",
          action: () => sendRequest("CLEANING"),
        },
        {
          type: "SOAP_REQUEST",
          label: "Soap Refill",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧼 Sending soap refillnow.",
          action: () => sendRequest("SOAP"),
        },
        {
          type: "BODY_WASH",
          label: "Body wash",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🚿 Body wash on the way.",
          action: () => sendRequest("BODY_WASH"),
        },
        {
          type: "SLIPPER",
          label: "Slippers (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🩴 Paid item. We’ll send it to ${roomNo}.`,
          action: () => sendRequest("SLIPPER", true),
        },
        {
          type: "DENTAL_KIT",
          label: "Dental kit (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🪥 Paid item. Dental kit to ${roomNo}.`,
          action: () => sendRequest("DENTAL_KIT", true),
        },
        {
          type: "SHAVING_KIT",
          label: "Shaving kit (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🪒 Paid item. Shaving kit to ${roomNo}.`,
          action: () => sendRequest("SHAVING_KIT", true),
        },
        {
          type: "SANITARY_PADS",
          label: "Sanitary pads (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🧻 Paid item. Pads to ${roomNo}.`,
          action: () => sendRequest("SANITARY_PADS", true),
        },
        {
          type: "IRON_REQUEST",
          label: "Iron / board",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧺 We’ll send an iron + board.",
          action: () => sendRequest("IRON"),
        },
        {
          type: "EXTRA_BLANKET",
          label: "Extra pillow / blanket",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🛏️ Extra bedding coming up.",
          action: () => sendRequest("BLANKET"),
        },
      ],
    },
    {
      category: "Maintenance",
      description: "Fix anything in the room",
      items: [
        {
          type: "TV_NOT_WORKING",
          label: "TV not working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "📺 Noted. We’ll check the TV.",
          action: () => reportIssue("TV"),
        },
        {
          type: "FLUSH_NOT_WORKING",
          label: "Flush issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🚽 Got it. We’ll fix the flush.",
          action: () => reportIssue("FLUSH"),
        },
        {
          type: "AC_NOT_WORKING",
          label: "AC not cooling",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "❄️ Tech will check the AC.",
          action: () => reportIssue("AC"),
        },
        {
          type: "LIGHT_ISSUE",
          label: "Lights issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "💡 We’ll fix the lights.",
          action: () => reportIssue("LIGHTS"),
        },
        {
          type: "GEYSER_ISSUE",
          label: "Geyser issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "♨️ Checking the geyser.",
          action: () => reportIssue("GEYSER"),
        },
        {
          type: "SOCKET_ISSUE",
          label: "Power socket issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🔌 We’ll look at the socket.",
          action: () => reportIssue("SOCKET"),
        },
        {
          type: "FRIDGE_ISSUE",
          label: "Fridge / minibar issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧊 We’ll check the fridge.",
          action: () => reportIssue("FRIDGE"),
        },
        {
          type: "FAN_ISSUE",
          label: "Fan not working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🌀 Fixing the fan soon.",
          action: () => reportIssue("FAN"),
        },
      ],
    },
    {
      category: "Food & Room Service",
      description: "Order food or get clearance",
      items: [
        {
          type: "ORDER_FOOD",
          label: "Order food (opens app)",
          kind: "REDIRECT",
          featured: false,
          isChargeable: false,
          reply: "🍽️ Opening the menu…",
          action: () => window.open("https://order.zenvana.in", "_blank"),
        },
        {
          type: "FOOD_CLEARANCE",
          label: "Clear the plates",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧹 We’ll clear it now.",
          action: () => sendRequest("FOOD_CLEARANCE"),
        },
        {
          type: "KIDS_MEAL",
          label: "Kids meal",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "👶 Kids meal noted.",
          action: () => sendRequest("KIDS_MEAL"),
        },
        {
          type: "JAIN_MEAL",
          label: "Jain / custom meal",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🌱 Jain/custom meal noted.",
          action: () => sendRequest("JAIN_MEAL"),
        },
        {
          type: "TABLE_BOOKING",
          label: "Book a table",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "📅 We’ll arrange a table and confirm.",
          action: () => sendRequest("TABLE_BOOKING"),
        },
      ],
    },
    {
      category: "Reception & Communication",
      description: "Call, checkout, help",
      items: [
        {
          type: "CALL_RECEPTION",
          label: "Call reception",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🛎️ Connecting you to reception.",
          action: () => {
            const phoneNumber = booking?.property?.receptionNo || "100";

            window.open(`tel:${phoneNumber}`, "_self");
          },
        },
        {
          type: "EMERGENCY_NUMBER",
          label: "Emergency help",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🚨 Emergency: 100 (hotel protocol applies).",
          action: () => alert("Emergency: 100 / hotel protocol"),
        },
        {
          type: "CHECKOUT_REQUEST",
          label: "Checkout request",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧳 Got it. We’ll start your checkout.",
          action: () => sendRequest("CHECKOUT"),
        },
        {
          type: "LOST_KEYCARD",
          label: "Lost key card",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🪪 No worries—reissuing your key.",
          action: () => sendRequest("KEYCARD"),
        },
        {
          type: "BOOK_TAXI",
          label: "Book a taxi",
          kind: "REDIRECT",
          featured: false,
          isChargeable: false,
          reply: "🚕 Opening taxi booking…",
          action: () => window.open("https://taxi.example.com", "_blank"),
        },
      ],
    },
  ] as const;
}

export interface GuestServiceItem {
  type: string;
  label: string;
  kind: "FUNCTION" | "CHARGEABLE" | "REDIRECT";
  featured: boolean;
  isChargeable: boolean;
  action: () => void | Promise<void> | unknown;
  reply?: string; // ← add this
}

export interface GuestServiceCategory {
  category: string;
  description: string;
  items: GuestServiceItem[];
}

function sendRequest(type: string, isPaid: boolean = false) {
  console.log(`Request sent: ${type}, Paid: ${isPaid}`);
  // example API call
  fetch("/api/service", {
    method: "POST",
    body: JSON.stringify({ type, isPaid }),
    headers: { "Content-Type": "application/json" },
  });
}

function reportIssue(issue: string) {
  console.log(`Issue reported: ${issue}`);
  fetch("/api/maintenance", {
    method: "POST",
    body: JSON.stringify({ issue }),
    headers: { "Content-Type": "application/json" },
  });
}
