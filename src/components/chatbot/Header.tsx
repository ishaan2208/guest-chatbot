import type { FC } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import HeaderScene from "./HeaderScene";
import ConciergeAvatar from "./ConciergeAvatar";
import ThemeToggle from "@/components/ThemeToggle";
import { bookingAtom } from "@/store/booking.recoil";
import { hardSignout } from "@/lib/sessionGuard";
import { useChatTyping } from "@/stores/chatTyping";

/**
 * App bar as a wide artful banner — a gold sunrise-over-hills motif behind the
 * "Zenvana" wordmark (no logo disc). Solid (no backdrop-filter) so it stays
 * cheap to composite while the transcript scrolls beneath it.
 */
const Header: FC = () => {
  const navigate = useNavigate();
  const booking = useRecoilValue(bookingAtom);
  const typing = useChatTyping((s) => s.typing);

  const roomNumber = (() => {
    const selectedId =
      typeof window !== "undefined" ? localStorage.getItem("roomNumberId") : null;
    const rooms = booking?.BookingRoom ?? [];
    const room = selectedId
      ? rooms.find((r) => String(r.id) === selectedId) ?? rooms[0]
      : rooms[0];
    const n = room?.roomNumber;
    return n && n !== "N/A" ? n : null;
  })();

  const emptyLocalStorage = () => {
    hardSignout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 overflow-hidden bg-background pt-safe shadow-[0_12px_28px_-24px_rgb(0_0_0_/_0.55)] dark:shadow-[0_14px_30px_-20px_rgb(0_0_0_/_0.8)]">
      {/* Wide artistic backdrop — quieter in dark so the gold doesn't wash out */}
      <HeaderScene className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full opacity-90 dark:opacity-55" />

      <div className="relative mx-auto flex h-[4.25rem] w-full max-w-md items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <ConciergeAvatar size={42} className="shrink-0 drop-shadow-sm" />
          <div className="flex min-w-0 flex-col justify-center">
          <h1 className="font-display text-[1.55rem] font-semibold leading-none tracking-tight text-foreground">
            Zenvana
          </h1>
          {typing ? (
            <p className="mt-1.5 flex items-center gap-1 text-[12.5px] font-medium leading-none text-success">
              <span className="typing-dot h-1 w-1" />
              <span className="typing-dot h-1 w-1" />
              <span className="typing-dot h-1 w-1" />
              <span className="ml-1">typing…</span>
            </p>
          ) : (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] leading-none text-muted-foreground">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-success"
              />
              <span className="truncate">
                Concierge{roomNumber ? ` · Room ${roomNumber}` : ""}
              </span>
            </p>
          )}
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => window.location.reload()}
            aria-label="Refresh concierge"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.94]"
          >
            <RefreshCw className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={emptyLocalStorage}
            aria-label="Sign out"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.94]"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Gold hairline crown */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent"
      />
    </header>
  );
};

export default Header;
