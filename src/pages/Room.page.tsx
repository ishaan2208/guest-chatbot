import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";
import {
  Home,
  MapPin,
  Clock,
  Users,
  Bed,
  ArrowRight,
  Sparkles,
  Wifi,
  Tv,
  Coffee,
  Wind
} from "lucide-react";

import axios from "../lib/axios.config";
import { Button } from "../components/ui/button";
import { PageTransition, StaggeredList } from "../components/animations/page-transitions";
import { InteractiveCard, AnimatedText } from "../components/animations/micro-interactions";
import { useCelebration } from "../components/animations/celebration";
import { useGuestProfile } from "../stores/guestProfile";
import { useUIState } from "../stores/ui";
import { guestStorage } from "../services/storage";
import { bookingAtom } from "@/store/booking.recoil";
import type { Booking as BookingStoreType } from "@/types/booking.types";

interface BookingRoom {
  id: number;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
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

export default function RoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { celebrate, celebrations } = useCelebration();
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
        guestStorage.clearAll();
        localStorage.removeItem("roomNumberId");
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

    celebrate('success', `Welcome to Room ${roomNumber}!`);

    setTimeout(() => {
      navigate(`/room/chatbot`);
      setShowOutlet(true);
    }, 1000);
  };

  // Calculate stay duration
  const getStayDuration = () => {
    if (!booking?.BookingRoom[0]) return null;

    const checkIn = new Date(booking.BookingRoom[0].checkIn);
    const checkOut = new Date(booking.BookingRoom[0].checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return nights;
  };

  // Get room amenities (mock data - in real app this would come from booking)
  const getRoomAmenities = () => [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Tv, label: "Smart TV" },
    { icon: Coffee, label: "Coffee Maker" },
    { icon: Wind, label: "Air Conditioning" },
  ];

  // Render outlet when navigating to chatbot
  if (showOutlet || isChatbotRoute) {
    return (
      <PageTransition>
        <Outlet />
      </PageTransition>
    );
  }

  // Loading state
  if (loading) {
    return (
      <PageTransition className="min-h-screen bg-linear-to-br from-background via-background/95 to-primary/5">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            className="text-center space-y-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              animate={{
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Home className="w-8 h-8 text-primary" />
            </motion.div>

            <div>
              <AnimatedText
                text="Preparing your stay..."
                className="text-xl font-semibold text-foreground"
              />
              <p className="text-muted-foreground mt-2">
                Loading your booking details
              </p>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Error state
  if (error) {
    return (
      <PageTransition className="min-h-screen bg-linear-to-br from-background via-destructive/5 to-background">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            className="text-center space-y-4 max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <Home className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Return to Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Room selection screen
  return (
    <PageTransition className="min-h-screen bg-linear-to-br from-background via-background/95 to-primary/5">
      <div className="min-h-screen p-4">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-4 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">
              <AnimatedText text="Welcome to Your Stay!" />
            </h1>
          </div>

          {booking && (
            <div className="space-y-2">
              <p className="text-lg text-foreground font-medium">
                {getContextualGreeting()}
              </p>
              {booking.BookingRoom.length > 1 && (
                <p className="text-muted-foreground">
                  You have multiple rooms. Please select your room to continue.
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Booking Summary Card */}
        {booking && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-6 shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {booking.property.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.property.address}
                  </p>
                </div>
              </div>

              {booking.BookingRoom[0] && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {getStayDuration()} nights
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {booking.BookingRoom[0].occupancy} guests
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Room Selection */}
        {booking && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              {booking.BookingRoom.length === 1 ? "Your Room" : "Select Your Room"}
            </h2>

            <StaggeredList className="space-y-4">
              {booking.BookingRoom.map((room) => (
                <motion.div key={room.id}>
                  <InteractiveCard
                    onClick={() => handleRoomClick(String(room.id), room.roomNumber)}
                    className="cursor-pointer"
                  >
                    <div className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bed className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">
                              Room {room.roomNumber}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {room.roomPlan} • {room.occupancy} guests
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      {/* Room amenities */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                        {getRoomAmenities().slice(0, 4).map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <amenity.icon className="w-3 h-3" />
                            <span>{amenity.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Check-in/out dates */}
                      <div className="flex justify-between text-xs text-muted-foreground mt-3">
                        <span>Check-in: {new Date(room.checkIn).toLocaleDateString()}</span>
                        <span>Check-out: {new Date(room.checkOut).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              ))}
            </StaggeredList>
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Once selected, you'll have access to all guest services
          </p>

          <div className="flex justify-center gap-4">
            {[
              { icon: "🛎️", label: "Concierge" },
              { icon: "🏨", label: "Room Service" },
              { icon: "🧹", label: "Housekeeping" },
            ].map((service, index) => (
              <motion.div
                key={service.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="text-2xl">{service.icon}</div>
                <span className="text-xs text-muted-foreground">{service.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {celebrations}
      </div>
    </PageTransition>
  );
}
