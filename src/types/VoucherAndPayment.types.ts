import type { Booking } from "./booking.types";

export type Payment = {
  amount: number;
  bookingId: number;
  collectedBy: string;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  id: number;
  mode: string;
  orderId: number | null;
  propertyId: number;
  remarks: string;
  restaurantId: number | null;
  subUserId: number;
  transactionId: string;
  updatedAt: string;
  waived: boolean;
  booking: Booking;
};

export type VoucherType = {
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  id: number;
  name: string;
  unitType: string;
  updatedAt: string;
  userId: number;
  voucherTag: string;
};

export type Voucher = {
  amount: number;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  id: number;
  propertyId: number;
  remarks: string;
  restaurantId: number | null;
  subUserId: number | null;
  title: string;
  type: string;
  updatedAt: string;
  userId: number;
  voucherType: VoucherType;
  voucherTypeId: number;
};
