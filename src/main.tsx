import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import GuestChatBot from "./components/chatbot/GuestChatBot.tsx";
import ChatbotLayout from "./components/chatbot/ChatbotLayout.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RecoilRoot } from "recoil";
import RoomPage from "./pages/Room.page.tsx";
import AuthLayout from "./components/Authlayout.tsx";
import ErrorFallback from "./components/ErrorFallback.tsx";
import { registerServiceWorker } from "./services/pwa.ts";

// Secondary tabs load on demand — keeps the sign-in → chat path lean.
// Login is lazy too: it carries react-hook-form + zod + the hero scene, which
// in-house guests (the common repeat visit) never need to download.
const Login = lazy(() => import("./pages/Login.page.tsx"));
const ServiceHistoryPage = lazy(() => import("./pages/ServiceHistory.page.tsx"));
const ProfilePage = lazy(() => import("./pages/Profile.page.tsx"));

const tabFallback = (
  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
    Loading…
  </div>
);

const provider = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider defaultTheme="system" storageKey="zenvana-theme">
        <RecoilRoot>
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        </RecoilRoot>
      </ThemeProvider>
    ),
    errorElement: (
      <ThemeProvider defaultTheme="system" storageKey="zenvana-theme">
        <ErrorFallback />
      </ThemeProvider>
    ),
    children: [
      {
        path: "/login",
        // No spinner fallback: on first load the boot splash still covers the
        // screen while this chunk streams in; afterwards it's SW-cached.
        element: (
          <Suspense fallback={null}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/room",
        element: <RoomPage />,
        children: [
          {
            path: "chatbot",
            element: <ChatbotLayout />,
            children: [
              { index: true, element: <GuestChatBot /> },
              {
                path: "history",
                element: (
                  <Suspense fallback={tabFallback}>
                    <ServiceHistoryPage />
                  </Suspense>
                ),
              },
              {
                path: "profile",
                element: (
                  <Suspense fallback={tabFallback}>
                    <ProfilePage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={provider} />
);

// Boot choreography — the splash hands off to the app as one composed motion:
// 1. While `boot-hold` is on <html>, all entry animations under #root sit
//    paused at their first frame (see index.css), so the staggered message /
//    chip rises don't silently play out underneath the splash.
// 2. We wait for React's first paint, the display fonts (capped so a slow
//    connection never stalls the reveal), and a minimum splash dwell (so the
//    logo pop doesn't get cut mid-animation on fast devices).
// 3. Then the hold lifts and the splash fades in the same frame — the app's
//    staggered entrance plays exactly as the curtain rises.
const BOOT_MIN_DWELL_MS = 400;
const BOOT_FONT_WAIT_CAP_MS = 800;
const bootStart = performance.now();

function dismissBootSplash() {
  document.documentElement.classList.remove("boot-hold");
  const boot = document.getElementById("boot-splash");
  if (!boot) return;
  boot.classList.add("is-hidden");
  const remove = () => boot.remove();
  boot.addEventListener("transitionend", remove, { once: true });
  window.setTimeout(remove, 700);
}

let bootDismissScheduled = false;
function scheduleBootDismiss() {
  if (bootDismissScheduled) return;
  bootDismissScheduled = true;

  const fontsReady: Promise<unknown> =
    "fonts" in document
      ? Promise.race([
          document.fonts.ready,
          new Promise((r) => window.setTimeout(r, BOOT_FONT_WAIT_CAP_MS)),
        ])
      : Promise.resolve();

  fontsReady.then(() => {
    const dwellLeft = BOOT_MIN_DWELL_MS - (performance.now() - bootStart);
    window.setTimeout(dismissBootSplash, Math.max(0, dwellLeft));
  });
}

// Primary path: after React's first painted frame.
requestAnimationFrame(() => requestAnimationFrame(scheduleBootDismiss));
// rAF never ticks in hidden tabs — if the app was opened in the background,
// run the choreography the moment it becomes visible instead.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") scheduleBootDismiss();
});
// Absolute fallback (quirky webviews): never leave the splash up past ~2.5s.
window.setTimeout(scheduleBootDismiss, 2500);

registerServiceWorker();
