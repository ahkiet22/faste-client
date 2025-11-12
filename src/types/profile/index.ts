import { GENDER } from '@/constants';

export type TUpdateProfile = {
  name: string;
  avatar: string | null;
  phoneNumber: string;
  gender: GENDER | null;
  dateOfBirth: Date | null;
};

export type TChangePasswordBody = {
  oldPassword: string;
  confirmNewPassword: string;
  newPassword: string;
};
