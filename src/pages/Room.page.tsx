import { bookingAtom } from "@/store/booking.recoil";
import axios from "../lib/axios.config";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import type { BookingRoom } from "@/types/booking.types";

export default function RoomPage() {
  // Get bookingId , phoneNumber, and roomNumber from localStorage
  const bookingId = localStorage.getItem("bookingId");
  const phoneNumber = localStorage.getItem("phoneNumber");
  const roomNumber = localStorage.getItem("roomNumber");

  //state for booking and loading
  const [booking, setBooking] = useRecoilState(bookingAtom);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  // If bookingId or phoneNumber is not present, redirect to login page
  useEffect(() => {
    if (!bookingId || !phoneNumber) {
      navigate("/login");
    }
  }, [bookingId, phoneNumber, navigate]);

  // Fetch booking details using bookingId and phoneNumber

  useEffect(() => {
    if (!bookingId || !phoneNumber) return;

    axios
      .get(`chatbot/booking`, {
        params: {
          bookingId,
          phoneNumber,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setBooking(data);
        setLoading(false);

        if (roomNumber) {
          const room = data.BookingRoom.find(
            (room: BookingRoom) => room.roomNumber === roomNumber
          );
          if (room) {
            navigate(`/chatbot`);
          }
        } else if (data.BookingRoom.length === 1) {
          const room = data.BookingRoom[0];
          localStorage.setItem("roomNumber", room.roomNumber);
          navigate(`/chatbot`);
        }
      });
  }, [bookingId, phoneNumber, navigate, roomNumber]);

  return loading ? (
    <Loading />
  ) : (
    <>
      {" "}
      <div className=" p-4">
        <h1 className="text-xl font-bold text-center mt-4">
          Select Room Number
        </h1>
        {booking?.BookingRoom.map((room) => (
          <div
            key={room.id}
            className="px-2 py-1 rounded-sm shadow-md mb-4 border-1 w-fit"
          >
            <p className="text-sm font-semibold">{room.roomNumber}</p>
            {/* <p className="text-gray-600">
            <strong>Price:</strong> ${room.price}
          </p> */}
          </div>
        ))}
      </div>
    </>
  );
}
