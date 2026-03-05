import axios from "@/lib/axios.config";
import { guestStorage } from "@/services/storage";

const HARD_SIGNOUT_AT_KEY = "zenvana_hard_signout_at";
const BOOKING_CACHE_PREFIX = "zenvana_booking_cache:";
const HARD_SIGNOUT_TTL_MS = 2 * 60 * 1000;

type BookingRoomLite = {
  id: number | string;
  status?: string | null;
};

function normalizeStatus(status?: string | null): string {
  return (status ?? "").replace(/[^a-z]/gi, "").toUpperCase();
}

function isInHouseStatus(status?: string | null): boolean {
  const normalized = normalizeStatus(status);
  return normalized === "INHOUSE" || normalized === "CHECKEDIN" || normalized === "OCCUPIED";
}

function readHardSignoutTimestamp(): number | null {
  const raw = localStorage.getItem(HARD_SIGNOUT_AT_KEY);
  if (!raw) return null;
  const ts = Number(raw);
  return Number.isFinite(ts) ? ts : null;
}

export function isHardSignoutActive(): boolean {
  const ts = readHardSignoutTimestamp();
  if (!ts) return false;
  const active = Date.now() - ts < HARD_SIGNOUT_TTL_MS;
  if (!active) localStorage.removeItem(HARD_SIGNOUT_AT_KEY);
  return active;
}

export function clearHardSignoutFlag(): void {
  localStorage.removeItem(HARD_SIGNOUT_AT_KEY);
}

export function hardSignout(): void {
  localStorage.setItem(HARD_SIGNOUT_AT_KEY, String(Date.now()));
  guestStorage.clearAll();
  localStorage.removeItem("roomNumberId");
  localStorage.removeItem("bookingId");
  localStorage.removeItem("phoneNumber");
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(BOOKING_CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

export async function assertActiveInhouseStay(bookingRoomId?: number | string | null): Promise<void> {
  const session = guestStorage.getSession() as
    | { bookingId?: number | string; phoneNumber?: string }
    | undefined;
  const bookingId = session?.bookingId;
  const phoneNumber = session?.phoneNumber;
  if (!bookingId || !phoneNumber) {
    hardSignout();
    throw new Error("Session expired. Please sign in again.");
  }

  const response = await axios.get("chatbot/booking", {
    params: { bookingId, phoneNumber },
  });
  const booking = response?.data?.data as { BookingRoom?: BookingRoomLite[] } | undefined;
  const rooms = Array.isArray(booking?.BookingRoom) ? booking.BookingRoom : [];
  const selectedRoomId =
    String(bookingRoomId ?? localStorage.getItem("roomNumberId") ?? "");
  const selectedRoom =
    rooms.find((room) => String(room.id) === selectedRoomId) ??
    (rooms.length === 1 ? rooms[0] : undefined);

  if (!selectedRoom) {
    hardSignout();
    throw new Error("Your room assignment changed. Please sign in again.");
  }

  if (!isInHouseStatus(selectedRoom.status)) {
    hardSignout();
    throw new Error("Your stay is no longer active. Please sign in again.");
  }
}
