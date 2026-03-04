import { Clock } from "lucide-react";
import { useGuestProfile } from "@/stores/guestProfile";
import { Card, CardContent } from "@/components/ui/card";

const SERVICE_LABELS: Record<string, string> = {
  EXTRA_TOWELS: "More towels",
  WATER_REFILL: "Water top-up",
  ROOM_CLEANING: "Room cleaning",
  FOOD_CLEARANCE: "Clear the plates",
  WIFI_PASSWORD: "Wi-Fi password",
  TV_NOT_WORKING: "TV not working",
  FLUSH_NOT_WORKING: "Flush issue",
  AC_NOT_WORKING: "AC not cooling",
  LIGHT_ISSUE: "Lights issue",
  GEYSER_ISSUE: "Geyser issue",
  SOCKET_ISSUE: "Power socket issue",
  FRIDGE_ISSUE: "Fridge / minibar",
  FAN_ISSUE: "Fan not working",
  SOAP_REQUEST: "Soap refill",
  BODY_WASH: "Body wash",
  IRON_REQUEST: "Iron / board",
  EXTRA_BLANKET: "Extra pillow / blanket",
  ORDER_FOOD: "Order food",
  KIDS_MEAL: "Kids meal",
  JAIN_MEAL: "Jain / custom meal",
  TABLE_BOOKING: "Book a table",
  CALL_RECEPTION: "Call reception",
  EMERGENCY_NUMBER: "Emergency help",
  CHECKOUT_REQUEST: "Checkout request",
  LOST_KEYCARD: "Lost key card",
  BOOK_TAXI: "Book a taxi",
};

export default function ServiceHistoryPage() {
  const { requestHistory, isReturningGuest } = useGuestProfile();

  return (
    <div className="mx-auto h-full w-full max-w-md pb-20 pt-2">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Service History</h1>
      </div>
      <Card className="rounded-2xl border border-white/30 bg-white/40 shadow-lg supports-backdrop-filter:backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/30">
        <CardContent className="p-4">
          {requestHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              {isReturningGuest
                ? "No service requests yet this stay."
                : "Your recent service requests will appear here."}
            </p>
          ) : (
            <ul className="space-y-3">
              {[...requestHistory].reverse().map((req, idx) => (
                <li
                  key={`${req.type}-${req.timestamp}-${idx}`}
                  className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0"
                >
                  <span className="text-foreground">
                    {SERVICE_LABELS[req.type] ?? req.type}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(req.timestamp).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
