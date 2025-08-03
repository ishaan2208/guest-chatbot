import { bookingAtom } from "@/store/booking.recoil";
import { useRecoilValue } from "recoil";

export function useGuestServiceMenu() {
  const booking = useRecoilValue(bookingAtom);
  return [
    {
      category: "🧹 Housekeeping & Essentials",
      description: "Towels, water, toiletries, kits, cleaning",
      items: [
        {
          type: "WIFI_PASSWORD",
          label: "Wi-Fi Password",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          reply: `Your Wi-Fi password is: ${
            booking?.property.wifiPassword || "Not available"
          }`,
          action: () => {
            console.log("Fetching Wi-Fi password...");
            return null;
          },
        },
        {
          type: "EXTRA_TOWELS",
          label: "Extra Towels",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          action: () => sendRequest("TOWELS"),
        },
        {
          type: "WATER_REFILL",
          label: "Water Refill",
          kind: "FUNCTION",
          featured: true,
          isChargeable: false,
          action: () => sendRequest("WATER"),
        },
        {
          type: "ROOM_CLEANING",
          label: "Room Cleaning",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("CLEANING"),
        },
        {
          type: "SOAP_REQUEST",
          label: "Soap",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("SOAP"),
        },
        {
          type: "BODY_WASH",
          label: "Body Wash",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("BODY_WASH"),
        },
        {
          type: "SLIPPER",
          label: "Slipper (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          action: () => sendRequest("SLIPPER", true),
        },
        {
          type: "DENTAL_KIT",
          label: "Dental Kit (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          action: () => sendRequest("DENTAL_KIT", true),
        },
        {
          type: "SHAVING_KIT",
          label: "Shaving Kit (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          action: () => sendRequest("SHAVING_KIT", true),
        },
        {
          type: "SANITARY_PADS",
          label: "Sanitary Pads (₹)",
          kind: "CHARGEABLE",
          featured: false,
          isChargeable: true,
          action: () => sendRequest("SANITARY_PADS", true),
        },
        {
          type: "IRON_REQUEST",
          label: "Iron / Ironing Board",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("IRON"),
        },
        {
          type: "EXTRA_BLANKET",
          label: "Extra Pillow / Blanket",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("BLANKET"),
        },
      ],
    },
    {
      category: "🛠️ Maintenance",
      description: "Report room or appliance issues",
      items: [
        {
          type: "TV_NOT_WORKING",
          label: "TV Not Working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("TV"),
        },
        {
          type: "FLUSH_NOT_WORKING",
          label: "Flush Not Working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("FLUSH"),
        },
        {
          type: "AC_NOT_WORKING",
          label: "AC Not Cooling",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("AC"),
        },
        {
          type: "LIGHT_ISSUE",
          label: "Lights Not Working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("LIGHTS"),
        },
        {
          type: "GEYSER_ISSUE",
          label: "Geyser Not Heating",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("GEYSER"),
        },
        {
          type: "SOCKET_ISSUE",
          label: "Power Socket Issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("SOCKET"),
        },
        {
          type: "FRIDGE_ISSUE",
          label: "Fridge / Minibar Issue",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("FRIDGE"),
        },
        {
          type: "FAN_ISSUE",
          label: "Fan Not Working",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => reportIssue("FAN"),
        },
      ],
    },
    {
      category: "🍽️ Food & Room Service",
      description: "Order food, clearance or custom requests",
      items: [
        {
          type: "ORDER_FOOD",
          label: "Order Food (opens app)",
          kind: "REDIRECT",
          featured: false,
          isChargeable: false,
          action: () => window.open("https://order.zenvana.in", "_blank"),
        },
        {
          type: "FOOD_CLEARANCE",
          label: "Food Clearance",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("FOOD_CLEARANCE"),
        },
        {
          type: "KIDS_MEAL",
          label: "Kids Meal Request",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("KIDS_MEAL"),
        },
        {
          type: "JAIN_MEAL",
          label: "Jain / Custom Meal",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("JAIN_MEAL"),
        },
        {
          type: "TABLE_BOOKING",
          label: "Table Booking (Restaurant)",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("TABLE_BOOKING"),
        },
      ],
    },
    {
      category: "📞 Reception & Communication",
      description: "Reception, checkout, wake-up call etc.",
      items: [
        {
          type: "CALL_RECEPTION",
          label: "Call Reception",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => alert("Reception: +91-XXXX-XXX"),
        },
        {
          type: "EMERGENCY_NUMBER",
          label: "Emergency Number",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => alert("Emergency: 100 / hotel protocol"),
        },
        {
          type: "CHECKOUT_REQUEST",
          label: "Check-out Request",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("CHECKOUT"),
        },
        {
          type: "LOST_KEYCARD",
          label: "Lost Keycard",
          kind: "FUNCTION",
          featured: false,
          isChargeable: false,
          action: () => sendRequest("KEYCARD"),
        },
        {
          type: "BOOK_TAXI",
          label: "Book a Taxi",
          kind: "REDIRECT",
          featured: false,
          isChargeable: false,
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
