import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { guestStorage } from "@/services/storage";
import { NotificationToaster } from "@/components/ui/notification-toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Keep auth gate in sync with guestStorage session.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const session = guestStorage.getSession() as { bookingId?: string | number; phoneNumber?: string } | undefined;
    const bookingId = session?.bookingId;
    const phoneNumber = session?.phoneNumber;
    const roomNumberId = localStorage.getItem("roomNumberId");

    if (bookingId && phoneNumber) {
      if (location.pathname === "/login") {
        if (roomNumberId) {
          navigate("/room/chatbot", { replace: true });
        } else {
          navigate("/room", { replace: true });
        }
      }
    } else if (searchParams.has("bookingId") && searchParams.has("phoneNumber")) {
      guestStorage.setSession({
        bookingId: searchParams.get("bookingId"),
        phoneNumber: searchParams.get("phoneNumber"),
      });

      if (roomNumberId) {
        navigate("/room/chatbot", { replace: true });
      } else {
        navigate("/room", { replace: true });
      }
    } else if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="">
      <NotificationToaster />
      <div> {children}</div>
    </div>
  );
}
