import { API_ENDPOINT } from '@/configs/api';
import { ApiResponse } from '@/types/api-response';
import { TChangePasswordBody, TUpdateProfile } from '@/types/profile';
import axiosInstance from '@/utils/axios';

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.PROFILE.INDEX}`);
    return res.data;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Unable to fetch user profile. Please try again later.');
  }
};

export const updateProfile = async (data: TUpdateProfile) => {
  try {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.PROFILE.INDEX}`,
      data,
    );
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;

    return {
      status: 'error',
      data: null,
      message: 'Unable to update profile. Please try again later.',
      error: errorMessage,
      errorCode: errorCode,
    };
  }
};

export const changePassword = async (
  data: TChangePasswordBody,
): Promise<ApiResponse> => {
  try {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.PROFILE.CHANGE_PASSWORD}`,
      data,
    );

    return {
      status: 'success',
      message: 'Password changed successfully',
      data: res.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;

    if (errorMessage === 'Error.IncorrectPasswordException') {
      return {
        status: 'error',
        message: 'Current password is incorrect. Please try again.',
        data: null,
        error: errorMessage,
        errorCode: errorCode,
      };
    }
    return {
      status: 'error',
      message: 'Unable to change password. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
  }
};
