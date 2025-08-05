import { bookingAtom } from "@/store/booking.recoil";
import axios from "../lib/axios.config";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Loading from "@/components/Loading";
import { Outlet, useNavigate } from "react-router-dom";
import type { BookingRoom } from "@/types/booking.types";
import { Button } from "@/components/ui/button";

export default function RoomPage() {
  // Get bookingId , phoneNumber, and roomNumber from localStorage
  const bookingId = localStorage.getItem("bookingId");
  const phoneNumber = localStorage.getItem("phoneNumber");
  const roomNumberId = localStorage.getItem("roomNumberId");

  //state for booking and loading
  const [booking, setBooking] = useRecoilState(bookingAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [showOutlet, setShowOutlet] = useState<boolean>(false);

  const navigate = useNavigate();

  // If bookingId or phoneNumber is not present, redirect to login page
  useEffect(() => {
    if (!bookingId || !phoneNumber) {
      navigate("/login");
    }
  }, [bookingId, phoneNumber, navigate]);

  // Fetch booking details using bookingId and phoneNumber

  useEffect(() => {
    const start = Date.now();
    if (!bookingId || !phoneNumber) return;

    axios
      .get(`chatbot/booking`, {
        params: {
          bookingId,
          phoneNumber,
        },
      })
      .then((response) => {
        console.log("Booking data fetched:", response.data.data);
        const data = response.data.data;
        setBooking(data);
        const duration = Date.now() - start;
        const remaining = 1500 - duration;
        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }

        if (roomNumberId) {
          const room = data.BookingRoom.find(
            (room: BookingRoom) => String(room.id) === roomNumberId
          );
          if (room) {
            navigate(`/room/chatbot`);
            setShowOutlet(true);
          }
        } else if (data.BookingRoom.length === 1) {
          const room = data.BookingRoom[0];
          localStorage.setItem("roomNumber", room.id);
          navigate(`/room/chatbot`);
          setShowOutlet(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching booking data:", error);
        setLoading(false);
        localStorage.removeItem("bookingId");
        localStorage.removeItem("phoneNumber");
        localStorage.removeItem("roomNumberId");
        navigate("/login");
      });
  }, [bookingId, phoneNumber, navigate, roomNumberId, setBooking]);

  const handleRoomClick = ({ roomNumberId }: { roomNumberId: string }) => {
    if (roomNumberId) {
      localStorage.setItem("roomNumberId", roomNumberId);
    }
    navigate(`/room/chatbot`);
    setShowOutlet(true);
  };

  return loading ? (
    <Loading />
  ) : showOutlet ? (
    <>
      <Outlet />
    </>
  ) : (
    <>
      <div className=" p-4">
        <h1 className="text-xl font-bold text-center mt-4">Select Room</h1>
        <div className=" flex space-x-2 flex-wrap justify-center mt-4">
          {booking?.BookingRoom.map((room) => (
            <Button
              onClick={() => handleRoomClick({ roomNumberId: String(room.id) })}
              key={room.id}
              className="px-2 py-1 rounded-sm shadow-md mb-4 border-1 w-fit cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-semibold">{room.roomNumber}</p>
              {/* <p className="text-gray-600">
            <strong>Price:</strong> ${room.price}
          </p> */}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
