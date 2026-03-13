import { API_ENDPOINT } from '@/configs/api';
import { TAdminUserListParams } from '@/types/admin/user';
import axiosInstance from '@/utils/axios';

export const getAdminUsers = async (params?: TAdminUserListParams) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.USER.INDEX}`, {
      params: {
        ...params,
        role: 'CLIENT',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Unable to fetch users. Please try again later.');
  }
};

export const getAdminUserById = async (userId: string | number) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.USER.INDEX}/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Error getting user detail:', error);
    throw new Error('Unable to fetch user detail. Please try again later.');
  }
};

export const getAdminSellers = async (params?: TAdminUserListParams) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.USER.INDEX}`, {
      params: {
        ...params,
        role: 'SELLER',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error getting sellers:', error);
    throw new Error('Unable to fetch sellers. Please try again later.');
  }
};

export const updateUserStatus = async (
  userId: number,
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED',
) => {
  try {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.USER.INDEX}/${userId}/status`,
      { status },
    );
    return res.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error('Unable to update user status. Please try again later.');
  }
};

export const getShopRequests = async (params?: any) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.USER.INDEX}/shop-requests`,
      {
        params,
      },
    );
    return res.data;
  } catch (error) {
    console.error('Error getting shop requests:', error);
    throw new Error('Unable to fetch shop requests. Please try again later.');
  }
};

export const handleShopRequest = async (
  requestId: number,
  status: 'APPROVED' | 'REJECTED',
  note?: string,
) => {
  try {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.USER.INDEX}/shop-requests/${requestId}/handle`,
      {
        status,
        note,
      },
    );
    return res.data;
  } catch (error) {
    console.error('Error handling shop request:', error);
    throw new Error('Unable to handle shop request. Please try again later.');
  }
};
