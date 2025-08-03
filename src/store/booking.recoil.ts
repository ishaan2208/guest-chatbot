import { atom } from "recoil";
import type { Booking } from "@/types/booking.types";

export const bookingAtom = atom<Booking | null>({
  key: "bookingAtomKey",
  default: null as Booking | null,
});
