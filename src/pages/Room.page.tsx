import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  MapPin,
  Clock,
  Users,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import axios from "../lib/axios.config";
import { useGuestProfile } from "../stores/guestProfile";
import { useUIState } from "../stores/ui";
import { guestStorage } from "../services/storage";
import { hardSignout } from "@/lib/sessionGuard";
import AmbientBackground from "@/components/AmbientBackground";
import Splash from "@/components/Splash";
import { bookingAtom } from "@/store/booking.recoil";
import type { Booking as BookingStoreType } from "@/types/booking.types";
import { stayCheckIn, stayCheckOut } from "@/lib/booking-room-dates";

interface BookingRoom {
  id: number;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  checkIn?: string | null;
  checkOut?: string | null;
  tariff: number;
  occupancy: number;
  children: number;
  roomPlan: string;
  status: string;
}

interface Booking {
  id: number;
  guestName: string;
  guestPhoneNumber: string;
  property: {
    name: string;
    address: string;
  };
  BookingRoom: BookingRoom[];
}

interface GuestSession {
  bookingId?: number | string;
  phoneNumber?: string;
}

interface CachedBookingEntry {
  data: Booking;
  cachedAt: number;
}

const bookingDataCache = new Map<string, Booking>();
const bookingRequestCache = new Map<string, Promise<Booking>>();
const BOOKING_CACHE_TTL_MS = 5 * 60 * 1000;
const getPersistentCacheKey = (cacheKey: string) => `zenvana_booking_cache:${cacheKey}`;
const debugBooking = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.debug("[RoomPage]", ...args);
  }
};

const getBookingCacheKey = (bookingId: number | string, phoneNumber: string) =>
  `${String(bookingId)}:${phoneNumber}`;

const normalizeRoomStatus = (status: string | null | undefined) =>
  (status ?? "").replace(/[^a-z]/gi, "").toUpperCase();

const isRoomInhouse = (status: string | null | undefined) => {
  const normalized = normalizeRoomStatus(status);
  return normalized === "INHOUSE" || normalized === "CHECKEDIN" || normalized === "OCCUPIED";
};

const fetchBookingOnce = async (
  bookingId: number | string,
  phoneNumber: string
): Promise<Booking> => {
  const cacheKey = getBookingCacheKey(bookingId, phoneNumber);
  const cached = bookingDataCache.get(cacheKey);
  if (cached) {
    debugBooking("fetch start", { source: "memory-cache", cacheKey });
    return cached;
  }

  try {
    const raw = localStorage.getItem(getPersistentCacheKey(cacheKey));
    if (raw) {
      const parsed = JSON.parse(raw) as CachedBookingEntry;
      if (Date.now() - parsed.cachedAt < BOOKING_CACHE_TTL_MS) {
        bookingDataCache.set(cacheKey, parsed.data);
        debugBooking("fetch start", { source: "localStorage-cache", cacheKey });
        return parsed.data;
      }
      localStorage.removeItem(getPersistentCacheKey(cacheKey));
    }
  } catch {
    // Ignore malformed cache entries and continue with network request.
  }

  const inFlight = bookingRequestCache.get(cacheKey);
  if (inFlight) {
    debugBooking("fetch start", { source: "in-flight-request", cacheKey });
    return inFlight;
  }

  debugBooking("fetch start", { source: "network", cacheKey });
  const request = axios
    .get(`chatbot/booking`, {
      params: { bookingId, phoneNumber },
    })
    .then((response) => {
      const data = response.data.data as Booking;
      bookingDataCache.set(cacheKey, data);
      try {
        const payload: CachedBookingEntry = { data, cachedAt: Date.now() };
        localStorage.setItem(getPersistentCacheKey(cacheKey), JSON.stringify(payload));
      } catch {
        // Ignore storage quota issues.
      }
      debugBooking("fetch success", { source: "network", cacheKey });
      return data;
    })
    .finally(() => {
      bookingRequestCache.delete(cacheKey);
    });

  bookingRequestCache.set(cacheKey, request);
  return request;
};

const getCachedBooking = (
  bookingId: number | string,
  phoneNumber: string
): Booking | null => {
  const cacheKey = getBookingCacheKey(bookingId, phoneNumber);
  const inMemory = bookingDataCache.get(cacheKey);
  if (inMemory) return inMemory;

  try {
    const raw = localStorage.getItem(getPersistentCacheKey(cacheKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedBookingEntry;
    if (Date.now() - parsed.cachedAt < BOOKING_CACHE_TTL_MS) {
      bookingDataCache.set(cacheKey, parsed.data);
      return parsed.data;
    }
    localStorage.removeItem(getPersistentCacheKey(cacheKey));
  } catch {
    return null;
  }

  return null;
};

const formatDate = (value: string | Date) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export default function RoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile, getContextualGreeting } = useGuestProfile();
  const { addNotification } = useUIState();
  const setBookingStore = useSetRecoilState(bookingAtom);
  const isChatbotRoute = location.pathname.startsWith("/room/chatbot");

  // State management
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showOutlet, setShowOutlet] = useState<boolean>(isChatbotRoute);
  const [error, setError] = useState<string>("");

  // Get stored session data once per mount to avoid refetch loops
  const storedSession = useMemo(
    () => guestStorage.getSession() as GuestSession | undefined,
    []
  );
  const bookingId = storedSession?.bookingId;
  const phoneNumber = storedSession?.phoneNumber;
  const roomNumberId = useMemo(() => localStorage.getItem("roomNumberId"), []);
  const hasFetchedBooking = useRef(false);

  useEffect(() => {
    debugBooking("mount", {
      pathname: location.pathname,
      bookingId,
      hasPhoneNumber: Boolean(phoneNumber),
      hasRoomNumberId: Boolean(roomNumberId),
    });
    return () => {
      debugBooking("unmount", { pathname: location.pathname });
    };
  }, [location.pathname, bookingId, phoneNumber, roomNumberId]);

  const handleAutomaticNavigation = useCallback((data: Booking) => {
    // Parent route (/room) also renders at /room/chatbot.
    // Only auto-redirect from the room selection screen itself.
    if (location.pathname !== "/room") {
      debugBooking("auto-nav skipped", {
        reason: "not-on-room-root",
        pathname: location.pathname,
      });
      return;
    }

    if (roomNumberId) {
      const room = data.BookingRoom.find(
        (room: BookingRoom) => String(room.id) === roomNumberId
      );
      if (room) {
        debugBooking("auto-nav", {
          reason: "roomNumberId-found",
          target: "/room/chatbot",
          roomNumberId,
        });
        setTimeout(() => {
          navigate(`/room/chatbot`);
          setShowOutlet(true);
        }, 1000);
      }
    } else if (data.BookingRoom.length === 1) {
      const room = data.BookingRoom[0];
      debugBooking("auto-nav", {
        reason: "single-room-booking",
        target: "/room/chatbot",
        roomId: room.id,
      });
      localStorage.setItem("roomNumberId", String(room.id));
      setTimeout(() => {
        navigate(`/room/chatbot`);
        setShowOutlet(true);
      }, 1000);
    }
  }, [roomNumberId, navigate, location.pathname]);

  // Authentication check
  useEffect(() => {
    if (!bookingId || !phoneNumber) {
      navigate("/login");
    }
  }, [bookingId, phoneNumber, navigate]);

  // Fetch booking details
  useEffect(() => {
    if (isChatbotRoute) {
      if (bookingId && phoneNumber) {
        const cached = getCachedBooking(bookingId, phoneNumber);
        if (cached) {
          setBookingStore(cached as unknown as BookingStoreType);
          debugBooking("booking atom hydrated", { source: "cache", route: "chatbot" });
        }
      }
      debugBooking("fetch skipped", { reason: "chatbot-route" });
      return;
    }

    if (hasFetchedBooking.current) {
      debugBooking("fetch skipped", { reason: "already-fetched-this-mount" });
      return;
    }

    const fetchBookingData = async () => {
      if (!bookingId || !phoneNumber) return;

      hasFetchedBooking.current = true;

      try {
        const data = await fetchBookingOnce(bookingId, phoneNumber);
        const selectedRoomId = localStorage.getItem("roomNumberId");
        const selectedRoom = selectedRoomId
          ? data.BookingRoom.find((room) => String(room.id) === selectedRoomId)
          : undefined;
        if (selectedRoomId && (!selectedRoom || !isRoomInhouse(selectedRoom.status))) {
          throw new Error("Your room assignment changed. Please sign in again.");
        }
        if (!selectedRoomId && !data.BookingRoom.some((room) => isRoomInhouse(room.status))) {
          throw new Error("Your stay is no longer active. Please sign in again.");
        }

        setBooking(data);
        setBookingStore(data as unknown as BookingStoreType);

        // Update guest profile with booking data
        updateProfile({
          guestName: data.guestName,
          phoneNumber: data.guestPhoneNumber,
        });

        handleAutomaticNavigation(data);

      } catch (error: any) {
        console.error("Error fetching booking data:", error);

        const errorMessage = error.response?.status === 404
          ? "Booking not found or expired"
          : "Unable to load booking details";

        setError(errorMessage);

        // Clear stored data and redirect
        hardSignout();
        setBookingStore(null);

        addNotification({
          title: "Session Expired",
          message: "Please sign in again",
          type: "warning",
        });

        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, phoneNumber, roomNumberId, navigate, updateProfile, addNotification, handleAutomaticNavigation, isChatbotRoute, setBookingStore]);

  // Handle room selection
  const handleRoomClick = (roomId: string, roomNumber: string) => {
    localStorage.setItem("roomNumberId", roomId);

    // Update profile with selected room
    updateProfile({
      roomNumber: roomNumber
    });

    setTimeout(() => {
      navigate(`/room/chatbot`);
      setShowOutlet(true);
    }, 1000);
  };

  // Calculate stay duration
  const getStayDuration = () => {
    if (!booking?.BookingRoom[0]) return null;

    const checkIn = new Date(stayCheckIn(booking.BookingRoom[0]));
    const checkOut = new Date(stayCheckOut(booking.BookingRoom[0]));
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return nights;
  };

  // Render outlet when navigating to chatbot
  if (showOutlet || isChatbotRoute) {
    return <Outlet />;
  }

  // Loading state
  if (loading) {
    return <Splash message="Preparing your stay" sub="Loading your booking details…" />;
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center p-6">
        <AmbientBackground />
        <div className="animate-rise-in w-full max-w-md text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-destructive/25 bg-destructive/5">
            <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl tracking-tight text-foreground">
            Something went wrong
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-[15px] font-semibold text-primary-foreground transition-[opacity,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.98]"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  // Room selection screen
  return (
    <div className="relative min-h-dvh px-5 py-10">
      <AmbientBackground />
      <div className="mx-auto w-full max-w-md">
        {/* Greeting */}
        <div className="animate-rise-in">
          <h1 className="font-display text-[1.75rem] leading-tight tracking-tight text-foreground">
            Welcome to your stay
          </h1>
          {booking && (
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              {getContextualGreeting()}
            </p>
          )}
        </div>

        {/* Property summary */}
        {booking && (
          <div
            className="animate-rise-in mt-6 rounded-3xl border border-border bg-card p-5 shadow-(--shadow-card)"
            style={{ animationDelay: "60ms" }}
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
                <MapPin className="h-5 w-5 text-foreground" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug text-foreground">
                  {booking.property.name}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {booking.property.address}
                </p>
              </div>
            </div>

            {booking.BookingRoom[0] && (
              <div className="mt-4 flex gap-6 border-t border-border/70 pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 tabular-nums">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {getStayDuration()} nights
                </span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {booking.BookingRoom[0].occupancy} guests
                </span>
              </div>
            )}
          </div>
        )}

        {/* Room selection */}
        {booking && (
          <div className="mt-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              {booking.BookingRoom.length === 1 ? "Your room" : "Select your room"}
            </h2>

            <div className="mt-3 space-y-3">
              {booking.BookingRoom.map((room, idx) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleRoomClick(String(room.id), room.roomNumber)}
                  style={{ animationDelay: `${120 + idx * 50}ms` }}
                  className="animate-rise-in flex w-full items-center gap-4 rounded-3xl border border-border bg-card p-5 text-left shadow-(--shadow-card) transition-[border-color,transform] duration-150 ease-out touch-manipulation hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.98]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-2xl leading-none tracking-tight text-foreground tabular-nums">
                      Room {room.roomNumber}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {room.roomPlan} · {room.occupancy} guests
                    </p>
                    <p className="mt-2.5 text-[13px] text-muted-foreground tabular-nums">
                      {formatDate(stayCheckIn(room))} → {formatDate(stayCheckOut(room))}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}

        <p
          className="animate-rise-in mt-8 text-center text-[13px] text-muted-foreground"
          style={{ animationDelay: "240ms" }}
        >
          Once selected, you can request towels, housekeeping, food and more.
        </p>
      </div>
    </div>
  );
}
