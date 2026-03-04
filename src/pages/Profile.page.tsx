import { User } from "lucide-react";
import { useGuestProfile } from "@/stores/guestProfile";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const {
    guestName,
    roomNumber,
    phoneNumber,
    checkInDate,
    checkOutDate,
  } = useGuestProfile();

  return (
    <div className="mx-auto h-full w-full max-w-md pb-20 pt-2">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </div>
      <Card className="rounded-2xl border border-white/30 bg-white/40 shadow-lg supports-backdrop-filter:backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/30">
        <CardContent className="p-4 space-y-4">
          {guestName && (
            <div>
              <p className="text-xs text-muted-foreground">Guest name</p>
              <p className="text-sm font-medium text-foreground">{guestName}</p>
            </div>
          )}
          {roomNumber && (
            <div>
              <p className="text-xs text-muted-foreground">Room</p>
              <p className="text-sm font-medium text-foreground">{roomNumber}</p>
            </div>
          )}
          {phoneNumber && (
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{phoneNumber}</p>
            </div>
          )}
          {checkInDate && (
            <div>
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="text-sm font-medium text-foreground">{checkInDate}</p>
            </div>
          )}
          {checkOutDate && (
            <div>
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="text-sm font-medium text-foreground">{checkOutDate}</p>
            </div>
          )}
          {!guestName && !roomNumber && !phoneNumber && (
            <p className="text-sm text-muted-foreground py-4">
              Manage your stay preferences and settings.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
