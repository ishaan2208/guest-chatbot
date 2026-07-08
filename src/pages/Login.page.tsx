import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QrCode, AlertCircle, Loader2, ArrowRight } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { stayCheckIn, stayCheckOut } from "@/lib/booking-room-dates";
import { Input } from "../components/ui/input";
import axios from "../lib/axios.config";
import { useGuestProfile } from "../stores/guestProfile";
import { useUIState } from "../stores/ui";
import { guestStorage } from "../services/storage";
import { clearHardSignoutFlag, isHardSignoutActive } from "@/lib/sessionGuard";
import LoginHero from "@/components/LoginHero";
import Logo from "@/components/Logo";
import Splash from "@/components/Splash";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    })
    .max(12, {
      message: "Phone number must be at most 15 characters.",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    }),
});

interface QRSignInState {
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadProfile, getContextualGreeting, updateSession } = useGuestProfile();
  const { addNotification } = useUIState();

  // State management
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [shakeField, setShakeField] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [qrState, setQrState] = useState<QRSignInState>({
    isProcessing: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  });
  const qrLoginAttemptRef = useRef<string | null>(null);
  const initEffectRanRef = useRef(false);

  // Get stored credentials
  const storedSession = guestStorage.getSession() as { bookingId?: string | number; phoneNumber?: string } | undefined;
  const bookingRoomId = searchParams.get('bookingRoomId');
  const roomId = searchParams.get('roomId');
  const hasQrParam = Boolean(bookingRoomId || roomId);
  const hardSignoutActive = isHardSignoutActive();

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: (storedSession?.phoneNumber as string) || "",
    },
  });

  const handleBookingRoomLogin = useCallback(async (bookingRoomIdParam: string, fallbackRoomId?: string | null) => {
    setQrState({ isProcessing: true, isSuccess: false, isError: false, errorMessage: "" });

    try {
      const response = await axios.get(`/chatbot/guest-by-room?bookingRoomId=${bookingRoomIdParam}`);
      const data = response.data.data;

      guestStorage.setSession({
        bookingId: data.id,
        phoneNumber: data.guestPhoneNumber,
        roomNumber: data.roomNumber,
        guestName: data.guestName,
        checkInDate: String(stayCheckIn(data.BookingRoom?.[0]) || ""),
        checkOutDate: String(stayCheckOut(data.BookingRoom?.[0]) || ""),
      });
      clearHardSignoutFlag();

      if (data.selectedRoomId || data.bookingRoomId) {
        localStorage.setItem("roomNumberId", String(data.selectedRoomId || data.bookingRoomId));
      }

      setQrState({ isProcessing: false, isSuccess: true, isError: false, errorMessage: "" });
      updateSession();
      setTimeout(() => navigate("/room"), 2000);
    } catch (error: any) {
      console.error("Booking room login failed:", error);

      if (fallbackRoomId) {
        try {
          const fallbackResponse = await axios.get(`/chatbot/guest-by-room?roomId=${fallbackRoomId}`);
          const fallbackData = fallbackResponse.data.data;

          guestStorage.setSession({
            bookingId: fallbackData.id,
            phoneNumber: fallbackData.guestPhoneNumber,
            roomNumber: fallbackData.roomNumber,
            guestName: fallbackData.guestName,
            checkInDate: String(stayCheckIn(fallbackData.BookingRoom?.[0]) || ""),
            checkOutDate: String(stayCheckOut(fallbackData.BookingRoom?.[0]) || ""),
          });
          clearHardSignoutFlag();

          if (fallbackData.selectedRoomId || fallbackData.bookingRoomId) {
            localStorage.setItem(
              "roomNumberId",
              String(fallbackData.selectedRoomId || fallbackData.bookingRoomId)
            );
          }

          setQrState({ isProcessing: false, isSuccess: true, isError: false, errorMessage: "" });
          updateSession();
          setTimeout(() => navigate("/room"), 2000);
          return;
        } catch (fallbackError) {
          console.error("Fallback room login failed:", fallbackError);
        }
      }

      const errorMessage = error.response?.status === 404
        ? "No current stay found for this room. Please use your phone number to sign in."
        : "Something went wrong with QR sign-in. Please try again or use your phone number.";

      setQrState({
        isProcessing: false,
        isSuccess: false,
        isError: true,
        errorMessage
      });

      addNotification({
        title: "QR Sign-in Failed",
        message: errorMessage,
        type: "warning",
        duration: 8000,
      });
    }
  }, [addNotification, navigate, updateSession]);

  // QR code login handler
  const handleQRLogin = useCallback(async (roomIdParam: string) => {
    setQrState({ isProcessing: true, isSuccess: false, isError: false, errorMessage: "" });

    try {
      const response = await axios.get(`/chatbot/guest-by-room?roomId=${roomIdParam}`);
      const data = response.data.data;

      // Store session data
      guestStorage.setSession({
        bookingId: data.id,
        phoneNumber: data.guestPhoneNumber,
        roomNumber: data.roomNumber,
        guestName: data.guestName,
        checkInDate: String(stayCheckIn(data.BookingRoom?.[0]) || ""),
        checkOutDate: String(stayCheckOut(data.BookingRoom?.[0]) || ""),
      });
      clearHardSignoutFlag();

      // Store room number ID for routing
      if (data.selectedRoomId || data.bookingRoomId) {
        localStorage.setItem("roomNumberId", String(data.selectedRoomId || data.bookingRoomId));
      }

      setQrState({ isProcessing: false, isSuccess: true, isError: false, errorMessage: "" });
      updateSession();

      setTimeout(() => navigate("/room"), 2000);

    } catch (error: any) {
      console.error("QR login failed:", error);

      const errorMessage = error.response?.status === 404
        ? "No current stay found for this room. Please use your phone number to sign in."
        : "Something went wrong with QR sign-in. Please try again or use your phone number.";

      setQrState({
        isProcessing: false,
        isSuccess: false,
        isError: true,
        errorMessage
      });

      addNotification({
        title: "QR Sign-in Failed",
        message: errorMessage,
        type: "warning",
        duration: 8000,
      });
    }
  }, [addNotification, navigate, updateSession]);

  // Handle QR code login on mount
  useEffect(() => {
    if (hardSignoutActive && hasQrParam) {
      setQrState({
        isProcessing: false,
        isSuccess: false,
        isError: true,
        errorMessage: "You signed out recently. Please sign in manually to continue.",
      });
      navigate("/login", { replace: true });
      return;
    }

    const loginKey = bookingRoomId
      ? `bookingRoomId:${bookingRoomId}`
      : roomId
        ? `roomId:${roomId}`
        : null;

    if (!loginKey) {
      qrLoginAttemptRef.current = null;
      return;
    }

    if (qrLoginAttemptRef.current === loginKey) {
      return;
    }

    qrLoginAttemptRef.current = loginKey;

    if (bookingRoomId) {
      handleBookingRoomLogin(bookingRoomId, roomId);
      return;
    }
    if (roomId) {
      handleQRLogin(roomId);
    }
  }, [
    bookingRoomId,
    roomId,
    hasQrParam,
    hardSignoutActive,
    navigate,
    handleBookingRoomLogin,
    handleQRLogin,
  ]);

  // Check existing session
  useEffect(() => {
    if (initEffectRanRef.current) return;
    initEffectRanRef.current = true;

    loadProfile();

    if (storedSession?.bookingId && storedSession?.phoneNumber && !hasQrParam) {
      setRedirecting(true);
      setTimeout(() => navigate("/room"), 1600);
    }
  }, [
    hasQrParam,
    loadProfile,
    navigate,
    storedSession?.bookingId,
    storedSession?.phoneNumber,
  ]);

  // Phone number form submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitDisabled(true);

    try {
      const response = await axios.post("/chatbot/login", {
        phoneNumber: values.phoneNumber,
      });

      const data = response.data.data;

      // Store session data
      guestStorage.setSession({
        bookingId: data.id,
        phoneNumber: values.phoneNumber,
        guestName: data.guestName,
        checkInDate: String(stayCheckIn(data.BookingRoom?.[0]) || ""),
        checkOutDate: String(stayCheckOut(data.BookingRoom?.[0]) || ""),
      });
      clearHardSignoutFlag();

      updateSession();

      setRedirecting(true);
      setTimeout(() => navigate("/room"), 1600);

    } catch (error: any) {
      console.error("Login failed:", error);

      const errorMessage = error.response?.status === 404
        ? "No active booking found for this phone number."
        : "Login failed. Please check your phone number and try again.";

      form.setError("phoneNumber", {
        type: "manual",
        message: errorMessage,
      });
      setShakeField(true);

    } finally {
      setSubmitDisabled(false);
    }
  }

  // Post-login handoff — a branded moment while we route to the room.
  if (redirecting) {
    return (
      <Splash
        message="Welcome to Zenvana"
        sub="Preparing your stay…"
      />
    );
  }

  // Render QR processing state
  if (hasQrParam && (qrState.isProcessing || qrState.isSuccess)) {
    return qrState.isSuccess ? (
      <Splash
        message="Welcome to Zenvana"
        sub="You’re all set — opening your guest services…"
      />
    ) : (
      <Splash message="Signing you in" sub="Setting up your room’s concierge…" />
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden" style={{ background: "#0b1c34" }}>
      {/* Full illustrated night scene */}
      <LoginHero className="pointer-events-none absolute inset-x-0 top-0 h-[80vh] w-full" />
      {/* scene settles into the deep base so the glass card floats within the night */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52vh]"
        style={{ background: "linear-gradient(to bottom, transparent, #0b1c34 78%)" }}
      />

      <div
        className="relative z-10 flex min-h-dvh flex-col px-6"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
        }}
      >
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.34em] text-white/55">
          Zenvana · Dehradun
        </p>

        {/* Content rides low, over the scene */}
        <div className="mx-auto mt-auto w-full max-w-sm">
          <div className="animate-rise-in flex flex-col items-center text-center">
            <Logo size={74} glow />
            <h1 className="mt-4 font-display text-[2rem] font-semibold leading-[1.05] tracking-tight text-white">
              Welcome to Zenvana
            </h1>
            <p className="mt-2 text-[14.5px] text-white/70">{getContextualGreeting()}</p>
          </div>

          {/* QR error */}
          {qrState.isError && (
            <div className="animate-rise-in mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 backdrop-blur-md">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-white">QR sign-in issue</h3>
                <p className="mt-0.5 text-sm text-white/70">{qrState.errorMessage}</p>
              </div>
            </div>
          )}

          {/* Frosted-glass sign-in card, merged into the scene */}
          <div
            className="animate-rise-in relative mt-6 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-[0_28px_70px_-28px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            style={{ animationDelay: "60ms" }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-medium text-white/70">
                        Phone number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          autoComplete="tel"
                          onAnimationEnd={() => setShakeField(false)}
                          className={`h-14 rounded-xl border-white/20 bg-white/10 px-4 text-[17px] tracking-wide text-white tabular-nums placeholder:text-white/45 focus-visible:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold/50 ${shakeField ? "error-shake" : ""}`}
                        />
                      </FormControl>
                      <FormMessage className="text-[13px] text-red-300" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={submitDisabled}
                  className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-accent-foreground shadow-[0_10px_30px_-12px_rgba(219,230,76,0.6)] transition-[opacity,transform] duration-150 ease-out touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 motion-safe:active:scale-[0.98]"
                >
                  {submitDisabled ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="text-center text-[13px] leading-relaxed text-white/60">
                  Use the phone number from your booking.
                </p>
              </form>
            </Form>
          </div>

          {/* QR hint */}
          {!hasQrParam && (
            <div
              className="animate-rise-in mt-5 flex items-center justify-center gap-2 text-[13px] text-white/70"
              style={{ animationDelay: "120ms" }}
            >
              <QrCode className="h-4 w-4" aria-hidden="true" />
              <span>Or scan the QR code in your room</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
