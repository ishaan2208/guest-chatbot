import { createRoot } from "react-dom/client";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.page.tsx";
import GuestChatBot from "./components/chatbot/GuestChatBot.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RecoilRoot } from "recoil";
import RoomPage from "./pages/Room.page.tsx";
import AuthLayout from "./components/Authlayout.tsx";

const provider = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider defaultTheme="dark" storageKey="zenvana-theme">
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
            element: <GuestChatBot />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={provider} />
);
