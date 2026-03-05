import type { FC } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import ChatAvatar from "./Avatar";
import { hardSignout } from "@/lib/sessionGuard";

const Header: FC = () => {
  const navigate = useNavigate();
  const emptyLocalStorage = () => {
    hardSignout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-20 flex items-center justify-between gap-1 px-4 py-5
      border-b border-border supports-[backdrop-filter]:backdrop-blur-xl
      bg-background/80 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <ChatAvatar sender="bot" />
        <div className="flex flex-col">
          <h1 className="text-base font-medium text-foreground tracking-normal capitalize">
            Zenvana Concierge
          </h1>
          <p className="text-xs text-muted-foreground">At your service</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => window.location.reload()}
          aria-label="Refresh concierge"
          className="group text-muted-foreground transition-[transform,background-color,color] duration-200 ease-out motion-safe:hover:scale-[1.04] motion-safe:active:scale-[0.96] hover:text-foreground motion-reduce:transition-none"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:rotate-6" />
        </Button>
        <Button
          onClick={emptyLocalStorage}
          variant="outline"
          size="icon"
          aria-label="Logout"
          className="border-border bg-background/60 transition-[transform,background-color,color] duration-200 ease-out motion-safe:hover:scale-[1.04] motion-safe:active:scale-[0.96] hover:bg-background/80 motion-reduce:transition-none"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
