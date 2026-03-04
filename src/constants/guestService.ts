import { Capitalize } from "@/lib/Capitalize";
import { bookingAtom } from "@/store/booking.recoil";
import { useRecoilValue } from "recoil";
import { useUIState } from "@/stores/ui";

export function useGuestServiceMenu() {
  const booking = useRecoilValue(bookingAtom);

  // lightweight personalization
  const firstName = Capitalize(
    booking?.guestName?.split(" ")?.[0].toLowerCase() ||
    booking?.guest?.name?.split(" ")?.[0].toLowerCase() ||
    "Guest"
  );
  let roomNo =
    (typeof window !== "undefined" &&
      booking?.BookingRoom.find(
        (room) => String(room.id) === localStorage.getItem("roomNumberId")
      )?.roomNumber) ||
    booking?.BookingRoom?.[0]?.roomNumber ||
    "your room";
  roomNo = roomNo === "N/A" ? "your room" : roomNo;
  const wifiPass = booking?.property?.wifiPassword ?? "Not available";
  const bookingRoomId =
    localStorage.getItem("roomNumberId") || String(booking?.BookingRoom[0].id);

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
          action: () => {
            console.log();
            console.log("g", localStorage.getItem("roomNumberId"));
            return null;
          }, // reply handles content
        },
        {
          type: "EXTRA_TOWELS",
          label: "More towels",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          reply: `🧺 On it! Towels to ${roomNo}.`,
          action: async () => {
            setTimeout(() => {
              console.log("Requesting extra towels for:", roomNo);
            }, 5000);
            const action = await actionableAction(
              bookingRoomId,
              booking as Booking,
              "TOWELS"
            );
            console.log(
              "Actionable action for towels:",
              localStorage.getItem("roomNumberId")
            );
            if (action.existed) {
              return "Request already sent. We’ll send towels to " + roomNo;
            } else {
              return;
            }
          },
        },
        {
          type: "WATER_REFILL",
          label: "Water top-up",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          reply: `💧 Water coming to ${roomNo}.`,
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "WATER"),
        },
        {
          type: "ROOM_CLEANING",
          label: "Clean my room",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧹 Noted. Housekeeping will come shortly.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "CLEANING"),
        },
        {
          type: "SOAP_REQUEST",
          label: "Soap Refill",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧼 Sending soap refillnow.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "SOAP"),
        },
        {
          type: "BODY_WASH",
          label: "Body wash",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🚿 Body wash on the way.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "BODY_WASH"),
        },
        {
          type: "SLIPPER",
          label: "Slippers (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🩴 Paid item. We’ll send it to ${roomNo}.`,
          action: () =>
            actionableAction(
              bookingRoomId,
              booking as Booking,
              "SLIPPER",
              true
            ),
        },
        {
          type: "DENTAL_KIT",
          label: "Dental kit (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🪥 Paid item. Dental kit to ${roomNo}.`,
          action: () =>
            actionableAction(
              bookingRoomId,
              booking as Booking,
              "DENTAL_KIT",
              true
            ),
        },
        {
          type: "SHAVING_KIT",
          label: "Shaving kit (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🪒 Paid item. Shaving kit to ${roomNo}.`,
          action: () =>
            actionableAction(
              bookingRoomId,
              booking as Booking,
              "SHAVING_KIT",
              true
            ),
        },
        {
          type: "SANITARY_PADS",
          label: "Sanitary pads (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          reply: `🧻 Paid item. Pads to ${roomNo}.`,
          action: () =>
            actionableAction(
              bookingRoomId,
              booking as Booking,
              "SANITARY_PADS",
              true
            ),
        },
        {
          type: "IRON_REQUEST",
          label: "Iron / board",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧺 We’ll send an iron + board.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "IRON"),
        },
        {
          type: "EXTRA_BLANKET",
          label: "Extra pillow / blanket",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🛏️ Extra bedding coming up.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "BLANKET"),
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
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "TV"),
        },
        {
          type: "FLUSH_NOT_WORKING",
          label: "Flush issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🚽 Got it. We’ll fix the flush.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "FLUSH"),
        },
        {
          type: "AC_NOT_WORKING",
          label: "AC not cooling",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "❄️ Tech will check the AC.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "AC"),
        },
        {
          type: "LIGHT_ISSUE",
          label: "Lights issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "💡 We’ll fix the lights.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "LIGHTS"),
        },
        {
          type: "GEYSER_ISSUE",
          label: "Geyser issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "♨️ Checking the geyser.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "GEYSER"),
        },
        {
          type: "SOCKET_ISSUE",
          label: "Power socket issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🔌 We’ll look at the socket.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "SOCKET"),
        },
        {
          type: "FRIDGE_ISSUE",
          label: "Fridge / minibar issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧊 We’ll check the fridge.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "FRIDGE"),
        },
        {
          type: "FAN_ISSUE",
          label: "Fan not working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🌀 Fixing the fan soon.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "FAN"),
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
          action: () =>
            actionableAction(
              bookingRoomId,
              booking as Booking,
              "FOOD_CLEARANCE"
            ),
        },
        {
          type: "KIDS_MEAL",
          label: "Kids meal",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "👶 Kids meal noted.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "KIDS_MEAL"),
        },
        {
          type: "JAIN_MEAL",
          label: "Jain / custom meal",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🌱 Jain/custom meal noted.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "JAIN_MEAL"),
        },
        {
          type: "TABLE_BOOKING",
          label: "Book a table",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "📅 We’ll arrange a table and confirm.",
          action: () =>
            actionableAction(
              bookingRoomId,
              booking as Booking,
              "TABLE_BOOKING"
            ),
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
          action: () => {
            useUIState.getState().addNotification({
              title: "Emergency",
              message: "Dial 100 for emergency. Hotel protocol applies.",
              type: "warning",
              duration: 8000,
            });
            return "🚨 Emergency: 100 (hotel protocol applies). Please call if you need immediate help.";
          },
        },
        {
          type: "CHECKOUT_REQUEST",
          label: "Checkout request",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🧳 Got it. We’ll start your checkout.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "CHECKOUT"),
        },
        {
          type: "LOST_KEYCARD",
          label: "Lost key card",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          reply: "🪪 No worries—reissuing your key.",
          action: () =>
            actionableAction(bookingRoomId, booking as Booking, "KEYCARD"),
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

// Define ServiceKey as a union of all possible type strings
export type ServiceKey =
  | "WIFI_PASSWORD"
  | "EXTRA_TOWELS"
  | "WATER_REFILL"
  | "ROOM_CLEANING"
  | "SOAP_REQUEST"
  | "BODY_WASH"
  | "SLIPPER"
  | "DENTAL_KIT"
  | "SHAVING_KIT"
  | "SANITARY_PADS"
  | "IRON_REQUEST"
  | "EXTRA_BLANKET"
  | "TV_NOT_WORKING"
  | "FLUSH_NOT_WORKING"
  | "AC_NOT_WORKING"
  | "LIGHT_ISSUE"
  | "GEYSER_ISSUE"
  | "SOCKET_ISSUE"
  | "FRIDGE_ISSUE"
  | "FAN_ISSUE"
  | "ORDER_FOOD"
  | "FOOD_CLEARANCE"
  | "KIDS_MEAL"
  | "JAIN_MEAL"
  | "TABLE_BOOKING"
  | "CALL_RECEPTION"
  | "EMERGENCY_NUMBER"
  | "CHECKOUT_REQUEST"
  | "LOST_KEYCARD"
  | "BOOK_TAXI";

export interface GuestServiceItem {
  type: ServiceKey; // Ensures `type` is one of the values in SERVICE_KEYS
  label: string;
  kind: "FUNCTION" | "CHARGEABLE" | "REDIRECT";
  featured: boolean;
  isChargeable: boolean;
  action: () => void | Promise<void> | unknown;
  reply?: string;
}

export interface GuestServiceCategory {
  category: string;
  description: string;
  items: GuestServiceItem[];
}

import { createTicketFromItem } from "@/lib/api";

import type { Booking } from "@/types/booking.types";

function ctxFromBooking(booking: Booking, bookingRoomId: string) {
  const selectedRoom = booking?.BookingRoom?.find((room) => String(room.id) === bookingRoomId);
  const roomNumber =
    selectedRoom?.roomNumber ||
    booking?.BookingRoom?.[0]?.roomNumber ||
    "N/A";

  // API requires propertyId as number; derive from booking or selected room
  const rawPropertyId =
    booking?.propertyId ??
    (booking as { property?: { id?: number } })?.property?.id ??
    selectedRoom?.propertyId ??
    booking?.BookingRoom?.[0]?.propertyId;
  const propertyId = rawPropertyId != null ? Number(rawPropertyId) : undefined;
  if (propertyId == null || Number.isNaN(propertyId)) {
    throw new Error("Missing propertyId for ticket context. Ensure booking data is loaded.");
  }

  const bookingId =
    booking?.id != null ? Number(booking.id) : undefined;
  const roomId =
    selectedRoom?.roomId != null
      ? Number(selectedRoom.roomId)
      : booking?.BookingRoom?.[0]?.roomId != null
        ? Number(booking.BookingRoom[0].roomId)
        : undefined;
  const guestId =
    booking?.guestId != null ? Number(booking.guestId) : undefined;

  return {
    propertyId,
    bookingId: bookingId ?? null,
    roomId: roomId ?? null,
    guestId: guestId ?? null,
    bookingRoomId,
    roomNumber,
  };
}

async function actionableAction(
  bookingRoomId: string,
  booking: Booking,
  type: string,

  isPaid = false,
  details?: string
) {
  try {
    const ctx = ctxFromBooking(booking, bookingRoomId);
    const result = await createTicketFromItem(
      { type, isChargeable: isPaid, details },
      ctx
    );
    console.log("Ticket:", result);
    return result;
  } catch (e) {
    console.error(e);
  }
}

// function actionableAction(bookingRoomId,booking as Booking,type: string, isPaid: boolean = false) {
//   console.log(`Request sent: ${type}, Paid: ${isPaid}`);
//   // example API call
//   fetch("/api/service", {
//     method: "POST",
//     body: JSON.stringify({ type, isPaid }),
//     headers: { "Content-Type": "application/json" },
//   });
// }

// function actionableAction(bookingRoomId,booking as Booking,issue: string) {
//   console.log(`Issue reported: ${issue}`);
//   fetch("/api/maintenance", {
//     method: "POST",
//     body: JSON.stringify({ issue }),
//     headers: { "Content-Type": "application/json" },
//   });
// }
