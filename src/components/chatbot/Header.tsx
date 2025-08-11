import type { FC } from "react";
import { BadgeCheck, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import ChatAvatar from "./Avatar";

const Header: FC = () => {
  const navigate = useNavigate();
  const emptyLocalStorage = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("roomNumberId");
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-20 flex items-center justify-between gap-2 px-4 py-5
      border-b border-white/30 dark:border-white/10 supports-[backdrop-filter]:backdrop-blur-xl
      bg-white/60 dark:bg-slate-950/40 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]"
    >
      <button
        onClick={() => window.location.reload()}
        className="group flex items-center gap-3 focus:outline-none p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors backdrop-blur-2xl"
        aria-label="Reload concierge"
      >
        <ChatAvatar sender="bot" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-[13px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              Zenvana Concierge
            </h1>
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-1">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500">
              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/60" />
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              online
            </span>
          </div>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {/* <ModeToggle /> */}
        <Button
          onClick={emptyLocalStorage}
          variant="outline"
          size="icon"
          aria-label="Logout"
          className="border-white/40 dark:border-white/10 bg-white/40 dark:bg-transparent hover:bg-white/60"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
