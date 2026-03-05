import { useMemo } from "react";
import { User } from "lucide-react";
import { useGuestProfile } from "@/stores/guestProfile";
import { Card, CardContent } from "@/components/ui/card";
import { formatGuestName } from "@/lib/guestName";
import { guestStorage } from "@/services/storage";

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
      (guestStorage.getSession() as { phoneNumber?: string } | undefined) ?? {},
    []
  );

  const resolvedGuestName = guestName ?? persisted.guestName;
  const resolvedRoomNumber = roomNumber ?? persisted.roomNumber;
  const resolvedPhoneNumber = phoneNumber ?? persisted.phoneNumber ?? session.phoneNumber;
  const resolvedCheckInDate = checkInDate ?? persisted.checkInDate;
  const resolvedCheckOutDate = checkOutDate ?? persisted.checkOutDate;
  const guestDisplayName = formatGuestName(resolvedGuestName);

  return (
    <div className="mx-auto h-full w-full max-w-md pb-20 pt-2">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </div>
      <Card className="rounded-2xl border border-white/30 bg-white/40 shadow-lg supports-backdrop-filter:backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/30">
        <CardContent className="p-4 space-y-4">
          {guestDisplayName && (
            <div>
              <p className="text-xs text-muted-foreground">Guest name</p>
              <p className="text-sm font-medium text-foreground">{guestDisplayName}</p>
            </div>
          )}
          {resolvedRoomNumber && (
            <div>
              <p className="text-xs text-muted-foreground">Room</p>
              <p className="text-sm font-medium text-foreground">{resolvedRoomNumber}</p>
            </div>
          )}
          {resolvedPhoneNumber && (
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{resolvedPhoneNumber}</p>
            </div>
          )}
          {resolvedCheckInDate && (
            <div>
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="text-sm font-medium text-foreground">{resolvedCheckInDate}</p>
            </div>
          )}
          {resolvedCheckOutDate && (
            <div>
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="text-sm font-medium text-foreground">{resolvedCheckOutDate}</p>
            </div>
          )}
          {!guestDisplayName && !resolvedRoomNumber && !resolvedPhoneNumber && (
            <p className="text-sm text-muted-foreground py-4">
              Manage your stay preferences and settings.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
