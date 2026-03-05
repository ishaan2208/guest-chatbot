import { Outlet } from "react-router-dom";
import { useUIState } from "@/stores/ui";
import Header from "./Header";
import BackgroundFX from "./BackgroundFX";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BottomNav } from "@/components/mobile/bottom-nav";
import {
  SidebarNav,
  SidebarToggle,
} from "@/components/desktop/sidebar-nav";

/**
 * Layout shell for /room/chatbot: header, background, desktop nav, mobile bottom nav, and outlet for tab content.
 */
export default function ChatbotLayout() {
  const { isMobile } = useUIState();

  return (
    <div className="relative isolate h-dvh bg-gray-100 dark:bg-slate-950">
      {/* Layered backgrounds so transparent chat card shows beams + backdrop */}
      <AnimatedBackdrop />
      <div className="pointer-events-none fixed left-0 bottom-0 -z-10 h-[42%] w-[48%] opacity-40">
        <BackgroundBeams className="h-full w-full" />
      </div>
      <BackgroundFX />
      {!isMobile && <SidebarNav />}
      {!isMobile && <SidebarToggle />}

      <Header />

      <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-2 pt-20 sm:px-1">
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </div>

      {isMobile && <BottomNav />}
    </div>
  );
}
