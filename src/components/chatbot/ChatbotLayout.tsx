import { Outlet } from "react-router-dom";
import Header from "./Header";
import { BottomNav } from "@/components/mobile/bottom-nav";
import AmbientBackground from "@/components/AmbientBackground";

/**
 * Shell for /room/chatbot: ambient backdrop, solid header, outlet, bottom nav.
 * The background is one fixed, compositor-only layer (no blur filters, no
 * repaint on scroll) so it stays smooth on budget phones.
 */
export default function ChatbotLayout() {
  return (
    <div className="h-dvh">
      <AmbientBackground />
      {/* Wallpaper: faint 1.75x echo first, sharp fine layer second (paints on top) */}
      <div className="chat-pattern-lg" aria-hidden="true" />
      <div className="chat-pattern" aria-hidden="true" />
      <Header />

      <div
        className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col px-3"
        style={{
          paddingTop: "calc(4.25rem + env(safe-area-inset-top))",
          paddingBottom: "calc(3.25rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
