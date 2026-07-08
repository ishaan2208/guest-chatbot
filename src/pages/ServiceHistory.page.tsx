import { useMemo } from "react";
import { useGuestProfile } from "@/stores/guestProfile";
import { guestStorage } from "@/services/storage";
import { SERVICE_ART, artForType } from "@/components/chatbot/serviceArt";

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
  SLIPPER: "Slippers",
  DENTAL_KIT: "Dental kit",
  SHAVING_KIT: "Shaving kit",
  SANITARY_PADS: "Sanitary pads",
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

function formatWhen(timestamp: number): string {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (dayDiff === 0) return `Today · ${time}`;
  if (dayDiff === 1) return `Yesterday · ${time}`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** Renders the bespoke illustration for a service type (or the bell for empty). */
function ArtThumb({ type }: { type: string }) {
  const Art = type === "__bell" ? SERVICE_ART.bell : SERVICE_ART[artForType(type)];
  return <Art />;
}

export default function ServiceHistoryPage() {
  const { requestHistory, isReturningGuest } = useGuestProfile();
  const persistedProfile = useMemo(
    () =>
      (guestStorage.getProfile() as {
        requestHistory?: Array<{ type: string; timestamp: number }>;
        isReturningGuest?: boolean;
      } | undefined) ?? {},
    []
  );

  const resolvedRequestHistory =
    requestHistory.length > 0
      ? requestHistory
      : Array.isArray(persistedProfile.requestHistory)
        ? persistedProfile.requestHistory
        : [];
  const resolvedIsReturningGuest =
    isReturningGuest || Boolean(persistedProfile.isReturningGuest) || resolvedRequestHistory.length > 0;

  return (
    <div className="mx-auto h-full w-full max-w-md overflow-y-auto pt-5 pb-6">
      <h1 className="animate-rise-in px-1 font-display text-2xl tracking-tight text-foreground">
        Service history
      </h1>
      <p className="animate-rise-in mt-1 px-1 text-sm text-muted-foreground">
        Requests from this stay
      </p>

      {resolvedRequestHistory.length === 0 ? (
        <div
          className="animate-rise-in mt-6 overflow-hidden rounded-3xl border border-border bg-card text-center shadow-(--shadow-card)"
          style={{ animationDelay: "60ms" }}
        >
          <div className="aspect-[132/64] w-full overflow-hidden">
            <ArtThumb type="__bell" />
          </div>
          <div className="px-6 pb-10 pt-4">
            <p className="text-[15px] font-medium text-foreground">
              {resolvedIsReturningGuest
                ? "No requests yet this stay"
                : "Nothing requested yet"}
            </p>
            <p className="mx-auto mt-1.5 max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
              Ask the concierge for towels, water or housekeeping and it will show up here.
            </p>
          </div>
        </div>
      ) : (
        <ul
          className="animate-rise-in mt-6 divide-y divide-border/70 rounded-3xl border border-border bg-card px-4 shadow-(--shadow-card)"
          style={{ animationDelay: "60ms" }}
        >
          {[...resolvedRequestHistory].reverse().map((req, idx) => (
            <li
              key={`${req.type}-${req.timestamp}-${idx}`}
              className="flex items-center gap-3 py-3"
            >
              <span className="aspect-[132/84] w-16 shrink-0 overflow-hidden rounded-xl border border-border/60">
                <ArtThumb type={req.type} />
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-medium text-foreground">
                {SERVICE_LABELS[req.type] ?? req.type}
              </span>
              <span className="shrink-0 text-[12.5px] text-muted-foreground tabular-nums">
                {formatWhen(req.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
