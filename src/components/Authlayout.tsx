import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Function to clear localStorage and redirect to login page
  const navigate = useNavigate();
  //use react-router-dom to search parameters

  const searchParams = new URLSearchParams(window.location.search);

  // Check localStorage for bookingId ,phoneNumber on component mount
  useEffect(() => {
    //check localStorage for bookingId and phoneNumber
    const bookingId = localStorage.getItem("bookingId");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const roomNumber = localStorage.getItem("roomNumberId");

    if (bookingId && phoneNumber) {
      console.log("Booking found, proceeding to room page.");
      // If bookingId and phoneNumber are present, proceed to room page
      if (roomNumber) {
        navigate("/room/chatbot");
      } else {
        navigate("/room");
      }
    } else {
      if (searchParams.has("bookingId") && searchParams.has("phoneNumber")) {
        // If bookingId and phoneNumber are present in URL, set them in localStorage
        localStorage.setItem("bookingId", searchParams.get("bookingId")!);
        localStorage.setItem("phoneNumber", searchParams.get("phoneNumber")!);
        console.log("Booking found in URL, proceeding to room page.");
        navigate("/room");
      } else {
        // If bookingId and phoneNumber are not present, redirect to login page
        console.log("No booking found, redirecting to login page.");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div className="">
      <div> {children}</div>
    </div>
  );
}
