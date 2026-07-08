import { useMemo } from "react";
import { Phone, CalendarRange, DoorOpen } from "lucide-react";
import { useGuestProfile } from "@/stores/guestProfile";
import { formatGuestName } from "@/lib/guestName";
import { guestStorage } from "@/services/storage";
import StayScene from "@/components/chatbot/StayScene";

function formatStayDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export default function ProfilePage() {
  const {
    guestName,
    roomNumber,
    phoneNumber,
    checkInDate,
    checkOutDate,
  } = useGuestProfile();
  const persisted = useMemo(
    () =>
      (guestStorage.getProfile() as {
        guestName?: string;
        roomNumber?: string;
        phoneNumber?: string;
        checkInDate?: string;
        checkOutDate?: string;
      } | undefined) ?? {},
    []
  );
  const session = useMemo(
    () =>
      (guestStorage.getSession() as {
        phoneNumber?: string;
        guestName?: string;
        roomNumber?: string;
        checkInDate?: string;
        checkOutDate?: string;
      } | undefined) ?? {},
    []
  );

  const resolvedGuestName = guestName ?? persisted.guestName ?? session.guestName;
  const resolvedRoomNumber = roomNumber ?? persisted.roomNumber ?? session.roomNumber;
  const resolvedPhoneNumber = phoneNumber ?? persisted.phoneNumber ?? session.phoneNumber;
  const resolvedCheckInDate = checkInDate ?? persisted.checkInDate ?? session.checkInDate;
  const resolvedCheckOutDate = checkOutDate ?? persisted.checkOutDate ?? session.checkOutDate;
  const guestDisplayName = formatGuestName(resolvedGuestName);

  const checkIn = formatStayDate(resolvedCheckInDate);
  const checkOut = formatStayDate(resolvedCheckOutDate);
  const hasAnything =
    guestDisplayName || resolvedRoomNumber || resolvedPhoneNumber || checkIn || checkOut;

  return (
    <div className="mx-auto h-full w-full max-w-md overflow-y-auto pt-5 pb-6">
      <h1 className="animate-rise-in px-1 font-display text-2xl tracking-tight text-foreground">
        Your stay
      </h1>
      <p className="animate-rise-in mt-1 px-1 text-sm text-muted-foreground">
        Details from your booking
      </p>

      {!hasAnything ? (
        <div
          className="animate-rise-in mt-6 overflow-hidden rounded-3xl border border-border bg-card text-center shadow-(--shadow-card)"
          style={{ animationDelay: "60ms" }}
        >
          <div className="aspect-[132/60] w-full overflow-hidden">
            <StayScene className="h-full w-full" />
          </div>
          <p className="px-6 pb-10 pt-4 text-sm leading-relaxed text-muted-foreground">
            Your booking details will appear here after sign-in.
          </p>
        </div>
      ) : (
        <div
          className="animate-rise-in mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-(--shadow-card)"
          style={{ animationDelay: "60ms" }}
        >
          {/* Illustrated banner */}
          <div className="aspect-[132/52] w-full overflow-hidden border-b border-border/60">
            <StayScene className="h-full w-full" />
          </div>

          {/* Room hero */}
          <div className="border-b border-border/70 bg-secondary/50 px-6 py-6">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              <DoorOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Room
            </p>
            <p className="mt-1 font-display text-4xl leading-none tracking-tight text-foreground tabular-nums">
              {resolvedRoomNumber || "—"}
            </p>
            {guestDisplayName && (
              <p className="mt-2.5 text-[15px] font-medium text-foreground">
                {guestDisplayName}
              </p>
            )}
          </div>

          <div className="space-y-5 px-6 py-5">
            {(checkIn || checkOut) && (
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <CalendarRange className="h-4 w-4 text-foreground" aria-hidden="true" />
                </span>
                <div className="flex flex-1 items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-muted-foreground">Check-in</p>
                    <p className="text-[15px] font-medium text-foreground tabular-nums">
                      {checkIn ?? "—"}
                    </p>
                  </div>
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                  <div className="text-right">
                    <p className="text-[12px] text-muted-foreground">Check-out</p>
                    <p className="text-[15px] font-medium text-foreground tabular-nums">
                      {checkOut ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {resolvedPhoneNumber && (
              <div className="flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Phone className="h-4 w-4 text-foreground" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] text-muted-foreground">Phone</p>
                  <p className="text-[15px] font-medium text-foreground tabular-nums">
                    {resolvedPhoneNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
