import type { FC } from "react";
import { BadgeCheck, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

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
    <header className="flex items-center gap-2 border-b pb-2 mb-10  z-20 bg-black w-full justify-between">
      <div
        onClick={() => {
          //reload the page
          window.location.reload();
        }}
        className=" flex items-center gap-2"
      >
        <BadgeCheck className="h-6 w-6 text-green-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          Zenvana Concierge
        </h2>
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
