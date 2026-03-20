"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Smartphone,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import axios from "../lib/axios.config";
import { PageTransition } from "../components/animations/page-transitions";
import { InteractiveButton, AnimatedText, LoadingDots } from "../components/animations/micro-interactions";
import { useCelebration } from "../components/animations/celebration";
import { useGuestProfile } from "../stores/guestProfile";
import { useUIState } from "../stores/ui";
import { guestStorage } from "../services/storage";
import { clearHardSignoutFlag, isHardSignoutActive } from "@/lib/sessionGuard";

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
  const { celebrate, celebrations } = useCelebration();
  const { loadProfile, getContextualGreeting, updateSession } = useGuestProfile();
  const { addNotification, isMobile } = useUIState();

  // State management
  const [submitDisabled, setSubmitDisabled] = useState(false);
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
        checkInDate: data.BookingRoom?.[0]?.checkIn,
        checkOutDate: data.BookingRoom?.[0]?.checkOut,
      });
      clearHardSignoutFlag();

      if (data.selectedRoomId || data.bookingRoomId) {
        localStorage.setItem("roomNumberId", String(data.selectedRoomId || data.bookingRoomId));
      }

      setQrState({ isProcessing: false, isSuccess: true, isError: false, errorMessage: "" });
      celebrate('confetti', 'Welcome to your room!');
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
            checkInDate: fallbackData.BookingRoom?.[0]?.checkIn,
            checkOutDate: fallbackData.BookingRoom?.[0]?.checkOut,
          });
          clearHardSignoutFlag();

          if (fallbackData.selectedRoomId || fallbackData.bookingRoomId) {
            localStorage.setItem(
              "roomNumberId",
              String(fallbackData.selectedRoomId || fallbackData.bookingRoomId)
            );
          }

          setQrState({ isProcessing: false, isSuccess: true, isError: false, errorMessage: "" });
          celebrate('confetti', 'Welcome to your room!');
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
  }, [addNotification, celebrate, navigate, updateSession]);

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
        checkInDate: data.BookingRoom?.[0]?.checkIn,
        checkOutDate: data.BookingRoom?.[0]?.checkOut,
      });
      clearHardSignoutFlag();

      // Store room number ID for routing
      if (data.selectedRoomId || data.bookingRoomId) {
        localStorage.setItem("roomNumberId", String(data.selectedRoomId || data.bookingRoomId));
      }

      setQrState({ isProcessing: false, isSuccess: true, isError: false, errorMessage: "" });

      // Celebration and navigation
      celebrate('confetti', 'Welcome to your room!');
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
  }, [addNotification, celebrate, navigate, updateSession]);

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
      celebrate('success', 'Welcome back!');
      setTimeout(() => navigate("/room"), 1000);
    }
  }, [
    celebrate,
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
        checkInDate: data.BookingRoom?.[0]?.checkIn,
        checkOutDate: data.BookingRoom?.[0]?.checkOut,
      });
      clearHardSignoutFlag();

      celebrate('success', 'Login successful!');
      updateSession();

      setTimeout(() => navigate("/room"), 1000);

    } catch (error: any) {
      console.error("Login failed:", error);

      const errorMessage = error.response?.status === 404
        ? "No active booking found for this phone number."
        : "Login failed. Please check your phone number and try again.";

      form.setError("phoneNumber", {
        type: "manual",
        message: errorMessage,
      });

      // Shake animation for error
      const field = form.control._fields.phoneNumber;
      const inputEl = field && '_f' in field ? (field as { _f?: { ref?: HTMLElement } })._f?.ref : undefined;
      inputEl?.classList?.add('error-shake');
      setTimeout(() => inputEl?.classList?.remove('error-shake'), 500);

    } finally {
      setSubmitDisabled(false);
    }
  }

  // Render QR processing state
  if (hasQrParam && (qrState.isProcessing || qrState.isSuccess)) {
    return (
      <PageTransition className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            className="max-w-md w-full text-center space-y-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Logo */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                className="h-24 w-24 mx-auto mb-6"
                src="/Zenvana logo.svg"
                alt="Zenvana Logo"
              />
            </motion.div>

            {qrState.isProcessing && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto"
                >
                  <QrCode className="w-full h-full text-primary" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    Signing you in<LoadingDots />
                  </h2>
                  <p className="text-muted-foreground">
                    Welcome to your room! We're setting everything up.
                  </p>
                </div>
              </>
            )}

            {qrState.isSuccess && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 mx-auto text-green-500"
                >
                  <CheckCircle className="w-full h-full" />
                </motion.div>

                <div className="space-y-2">
                  <AnimatedText
                    text="Welcome to Zenvana!"
                    className="text-2xl font-bold text-foreground"
                  />
                  <p className="text-muted-foreground">
                    You're all set! Redirecting to your guest services...
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
        {celebrations}
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">

          {/* Header Section */}
          <motion.div
            className="text-center space-y-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img
                className="h-20 w-20 mx-auto"
                src="/Zenvana logo.svg"
                alt="Zenvana Logo"
              />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                <AnimatedText text="Welcome to Zenvana" />
              </h1>
              <p className="text-muted-foreground">
                {getContextualGreeting()}
              </p>
            </div>
          </motion.div>

          {/* QR Error Message */}
          <AnimatePresence>
            {qrState.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-warning/10 border border-warning/20 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-warning mb-1">QR Sign-in Issue</h3>
                    <p className="text-sm text-muted-foreground">{qrState.errorMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-xl"
          >
            <div className="space-y-6">

              {/* QR Code Info */}
              {!hasQrParam && (
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                    <QrCode className="w-4 h-4" />
                    <span>Scan the QR code in your room for instant access</span>
                  </div>
                </div>
              )}

              {/* Phone Login */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Sign in with Phone
                  </h2>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              inputMode="numeric"
                              placeholder="Enter your phone number"
                              className={`
                                text-foreground bg-background/50 border-border/50
                                focus:border-primary focus:ring-primary
                                transition-all duration-200
                                ${isMobile ? 'h-12 text-base' : 'h-10'}
                              `}
                              autoComplete="tel"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />

                    <InteractiveButton
                      variant={isMobile ? 'touch' : 'default'}
                      onClick={() => { }}
                      disabled={submitDisabled}
                      className={`
                        w-full bg-primary text-primary-foreground 
                        hover:bg-primary/90 focus:ring-2 focus:ring-primary
                        transition-all duration-200
                        ${isMobile ? 'h-12 text-base' : 'h-10'}
                        ${submitDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {submitDisabled ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Signing In<LoadingDots /></span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </div>
                    </InteractiveButton>
                  </form>
                </Form>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Enter the phone number used for your booking
                </p>
                {!hasQrParam && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Or scan the QR code in your room for instant access
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Access guest services instantly
            </p>
            <div className="flex justify-center gap-6">
              {[
                { icon: "🏨", label: "Room Service" },
                { icon: "🧹", label: "Housekeeping" },
                { icon: "🔧", label: "Maintenance" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="text-xl">{feature.icon}</div>
                  <span className="text-xs text-muted-foreground">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {celebrations}
      </div>
    </PageTransition>
  );
}
