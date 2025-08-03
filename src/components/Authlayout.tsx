import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Function to clear localStorage and redirect to login page
  const navigate = useNavigate();

  // Check localStorage for bookingId ,phoneNumber on component mount
  useEffect(() => {
    //check localStorage for bookingId and phoneNumber
    const bookingId = localStorage.getItem("bookingId");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const roomNumber = localStorage.getItem("roomNumberId");

    console.log("Booking ID:", bookingId);
    console.log("Phone Number:", phoneNumber);

    if (bookingId && phoneNumber) {
      console.log("Booking found, proceeding to room page.");
      // If bookingId and phoneNumber are present, proceed to room page
      if (roomNumber) {
        navigate("/room/chatbot");
      } else {
        navigate("/room");
      }
    } else {
      console.log("No booking found, redirecting to login page.");
      navigate("/login");
    }
  }, []);

  return (
    <div className="">
      <div> {children}</div>
    </div>
  );
}
