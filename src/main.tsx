import { createRoot } from "react-dom/client";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.page.tsx";
import GuestChatBot from "./components/chatbot/GuestChatBot.tsx";
import ChatbotLayout from "./components/chatbot/ChatbotLayout.tsx";
import ServiceHistoryPage from "./pages/ServiceHistory.page.tsx";
import ProfilePage from "./pages/Profile.page.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RecoilRoot } from "recoil";
import RoomPage from "./pages/Room.page.tsx";
import AuthLayout from "./components/Authlayout.tsx";
import { registerServiceWorker } from "./services/pwa.ts";

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
    children: [
      {
        path: "/login",
        element: <Login />,
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
              { path: "history", element: <ServiceHistoryPage /> },
              { path: "profile", element: <ProfilePage /> },
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

registerServiceWorker();
