import type { FC } from "react";
import { BadgeCheck, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import ChatAvatar from "./Avatar";

const Header: FC = () => {
  // Function to clear localStorage and redirect to login page

  const navigate = useNavigate();
  const emptyLocalStorage = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("roomNumberId");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="fixed flex top-0 left-0 items-center gap-2 z-20 bg-black w-full justify-between p-5  border-b-[1px] dark:border-gray-950 shadow-2xl shadow-bl max-h-16">
      <div
        onClick={() => {
          //reload the page
          window.location.reload();
        }}
        className=" flex items-center space-x-6"
      >
        <ChatAvatar sender="bot" />
        <div className="flex flex-col space-y-1">
          <div className="flex space-x-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
              Zenvana Concierge
            </h2>
            <BadgeCheck className="h-5 w-5 text-green-500" />
          </div>
          <div className=" space-x-1 flex items-center">
            <span className="bg-green-500 h-2 w-2 rounded-full inline-block"></span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
              online
            </span>
          </div>
        </div>
      </div>

      <div>
        <Button
          onClick={emptyLocalStorage}
          variant={"outline"}
          size={"icon"}
          className=""
        >
          <LogOut />
        </Button>
      </div>
    </header>
  );
};

export default Header;
