import type { size } from "zod";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Function to clear localStorage and redirect to login page
  const navigate = useNavigate();
  const emptyLocalStorage = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("roomNumber");
    // Redirect to login page
    navigate("/login");
  };

  // Check localStorage for bookingId ,phoneNumber on component mount
  useEffect(() => {
    //check localStorage for bookingId and phoneNumber
    const bookingId = localStorage.getItem("bookingId");
    const phoneNumber = localStorage.getItem("phoneNumber");

    console.log("Booking ID:", bookingId);
    console.log("Phone Number:", phoneNumber);

    if (bookingId && phoneNumber) {
      console.log("Booking found, proceeding to room page.");
      // If bookingId and phoneNumber are present, proceed to room page
      navigate("/room");
    } else {
      console.log("No booking found, redirecting to login page.");
      navigate("/login");
    }
  }, []);

  return (
    <div className="">
      <div>
        <Button onClick={emptyLocalStorage} size={"sm"}>
          Clear Booking Data
        </Button>
      </div>
      <div> {children}</div>
    </div>
  );
}
