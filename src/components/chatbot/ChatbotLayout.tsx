import { Outlet } from "react-router-dom";
import { useUIState } from "@/stores/ui";
import Header from "./Header";
import BackgroundFX from "./BackgroundFX";
import { BottomNav } from "@/components/mobile/bottom-nav";
import {
  SidebarNav,
  SidebarToggle,
} from "@/components/desktop/sidebar-nav";
import {
  CommandPalette,
  useCommandPalette,
  CommandPaletteTrigger,
} from "@/components/desktop/command-palette";

/**
 * Layout shell for /room/chatbot: header, background, desktop nav, mobile bottom nav, and outlet for tab content.
 */
export default function ChatbotLayout() {
  const { isMobile } = useUIState();
  useCommandPalette();

  return (
    <div className="relative isolate h-dvh bg-gray-100 dark:bg-slate-950">
      <BackgroundFX />
      {!isMobile && <SidebarNav />}
      {!isMobile && <SidebarToggle />}
      {!isMobile && <CommandPalette />}

      <Header />

      <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-2 pt-20 sm:px-4">
        {!isMobile && (
          <div className="mb-3 flex shrink-0 justify-end">
            <CommandPaletteTrigger />
          </div>
        )}
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </div>

      {isMobile && <BottomNav />}
    </div>
  );
}
