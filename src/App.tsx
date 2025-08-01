import "./App.css";
import GuestChatBot from "./components/chatbot/GuestChatBot";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen ">
        <GuestChatBot />
      </div>
    </ThemeProvider>
  );
}

export default App;
