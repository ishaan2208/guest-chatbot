import { atom } from "recoil";

export type UserCredentials = {
  phoneNumber: string;
  roomNumber: string;
};

export const credentialAtom = atom({
  key: "credentialAtomKey",
  default: {
    phoneNumber: "",
    roomNumber: "",
  },
});
