export type ActivityLog = {
  createdAt: string;
  id: number;
  propertyId: number;
  remarks: string;
  restaurantId: number | null;
  subUser: SubUser;
  subUserId: number;
  subject: string;
  type: string;
  bookingId: string;
};

export type SubUser = {
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  disabled: boolean;
  firstName: string;
  id: number;
  lastName: string;
  passcode: string;
  passcodeEnabled: boolean;
  passcodeExpiry: string | null;
  passcodeTries: number;
  password: string;
  propertyId: number;
  restaurantId: number;
  role: string;
  sessionVersion: number;
  updatedAt: string;
  userId: number;
  username: string;
};
