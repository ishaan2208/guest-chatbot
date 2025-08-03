export type Employee = {
  id: number;
  name: string;
  phone: string | null;
  amount: number;
  createdAt: string;
  active: boolean;
  attendance: Attendance[];
  deleted: boolean;
  deletedAt: string | null;
  leave: Leave[];
  onDuty: boolean;
  propertyId: number;
  restaurantId: number | null;
  role: string;
  shifttitle: string;
  updatedAt: string;
  userId: number;
  checkInTime: string;
};

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string;
  checkOut: string | null;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  remarks: string | null;
  updatedAt: string;
  attendanceType: string;
  byAdmin: boolean;
  tardy: boolean;
}

export interface Leave {
  id: string;
  employeeId: number;
  type: string;
  date: string;
  reason: string;
  status: string;
  leaveType: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
