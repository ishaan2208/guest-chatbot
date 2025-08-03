import type { ActivityLog } from "./activity.types";
import type {
  Property,
  RoomType,
  User,
  Restaurant,
  OtherCharges,
} from "./user.types";

export type Guest = {
  address: string;
  company: string;
  createdAt: string;
  dateOfBirth: string;
  deleted: boolean;
  deletedAt: null | string;
  email: string;
  gstNumber: string;
  id: number;
  idProof: string;
  idProofNumber: string;
  name: string;
  phoneNumber: string;
  propertyId: number;
  remarks: string;
  updatedAt: string;
  userId: number;
  ids: any[];
  tariff: number;
  tariffState: string;
  bookings: Booking[];
};

export type BookingRoom = {
  bookingId: number;
  checkIn: string;
  checkOut: string;
  checkedInAt: null | string;
  checkedOutAt: null | string;
  createdAt: string;
  deleted: boolean;
  deletedAt: null | string;
  id: number;
  occupancy: number;
  propertyId: number;
  remarks: null | string;
  roomId: null | number;
  status: string;
  subUserId: number;
  tariff: number;
  totalNight: number;
  updatedAt: string;
  roomNumber: string;
  booking: Booking;
  roomType: string;
  room_type: RoomType;
  roomTypeId: number;
  roomPlan: string;
};

export type Booking = {
  guestName: string;
  guestPhoneNumber: string;
  company: string;
  gstNumber: string;
  address: string;
  totalAmount: number;
  totalPaid: number;
  BookingRoom: BookingRoom[];
  OtherCharges: OtherCharges[];
  Payment: any[];
  billNumber: null | string;
  bookingReference: string;
  bookingStatus: string;
  completedRooms: number;
  createdAt: string;
  deleted: boolean;
  deletedAt: null | string;
  guest: Guest;
  guestId: number;
  id: number;
  email?: string;
  propertyId: number;
  remarks: string;
  source: string;
  subUserId: number;
  totalRooms: number;
  unasignedRooms: number;
  updatedAt: string;
  completedAt?: string;
  property: Property;
  subUser: User;
  rating: number;
  review: string;
  suggestion: string;
  activityLogs: ActivityLog[];
  orders: Order[];
  channelBookingId: string;
  channelBookingSource: string;
};

export type Room = {
  createdAt: string;
  deleted: boolean;
  deletedAt: null | string;
  id: number;
  occupiedBy: null | string;
  propertyId: number;
  roomNumber: string;
  roomStatus: string;
  roomType: string;
  updatedAt: string;
  BookingRoom: BookingRoom[];
  // roomType: string;
  room_type: RoomType;
  room_typeId: number;
};

export type Order = {
  address: string;
  billNumber: string;
  billPrinted: boolean;
  bookingId: number;
  company: string;
  completedAt: string | null;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  email: string;
  gstNumber: string;
  guestId: number;
  guestName: string;
  guestPhoneNumber: string;
  id: number;
  kot: Kot[];
  orderHeader: string;
  orderReference: string;
  orderStatus: string;
  propertyId: number;
  remarks: string;
  restaurantId: number;
  roomNumber: string;
  subUserId: number;
  tableId: number | null;
  tableTypeId: number | null;
  totalAmount: number;
  totalPaid: number;
  transferToReception: boolean;
  updatedAt: string;
  restaurant: Restaurant;
};

export type Kot = {
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  id: number;
  kotNumber: number;
  orderId: number;
  orderItems: OrderItem[];
  tableId: number | null;
  total: number;
  updatedAt: string;
};

export type OrderItem = {
  comment: string;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  discountAbsolute: number;
  discountPercentage: number;
  foodItemId: number;
  id: number;
  kotId: number;
  price: number;
  quantity: number;
  remarks: string | null;
  tax: number;
  title: string;
  updatedAt: string;
};
