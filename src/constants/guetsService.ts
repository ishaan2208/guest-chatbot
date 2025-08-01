export const guestServiceMenu = [
  {
    category: "Basic Needs",
    items: [
      {
        type: "EXTRA_TOWELS",
        label: "Extra Towels",
        reply: "Certainly! Fresh towels will reach your room shortly.",
        kind: "REQUEST",
      },
      {
        type: "WATER_REFILL",
        label: "Water Refill",
        reply: "We’ll have complimentary water bottles delivered right away.",
        kind: "REQUEST",
      },
    ],
  },
  {
    category: "Housekeeping",
    items: [
      {
        type: "ROOM_CLEANING",
        label: "Room Cleaning",
        reply:
          "Housekeeping has been scheduled. Please let us know if you’d prefer a specific time.",
        kind: "REQUEST",
      },
      {
        type: "LAUNDRY_PICKUP",
        label: "Laundry Pickup",
        reply: "Our staff will pick up your laundry bag within 15 minutes.",
        kind: "REQUEST",
      },
    ],
  },
  {
    category: "Dining & Room Service",
    items: [
      {
        type: "ORDER_FOOD",
        label: "Order Food",
        reply:
          "Our menu is on its way to your chat. Let us know your preferences!",
        kind: "REQUEST",
      },
      {
        type: "COMPLAINT",
        label: "Something’s Wrong ↗",
        reply: "We’re sorry! A manager will contact you immediately.",
        kind: "COMPLAINT",
      },
    ],
  },
] as const;

export type GuestServiceCategory = (typeof guestServiceMenu)[number];
export type GuestServiceItem = GuestServiceCategory["items"][number];
