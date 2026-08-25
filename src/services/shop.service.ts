import { API_ENDPOINT } from '@/configs/api';
import { ApiResponse } from '@/types/api-response';
import axiosInstance from '@/utils/axios';
import axios from 'axios';

export const getAllShopsPublic = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 12 },
) => {
  try {
    const res = await axios.get(`${API_ENDPOINT.SHOP.INDEX}`, {
      params,
    });

    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllShopsIsPublic = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 12 },
) => {
  try {
    const res = await axios.get(`${API_ENDPOINT.SHOP.INDEX}/public`, {
      params,
    });

    return {
      status: 'success',
      message: 'Fetch shops success.',
      data: res.data.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getDetailShopPublicBySlug = async (
  slug: string,
): Promise<ApiResponse> => {
  try {
    const res = await axios.get(`${API_ENDPOINT.SHOP.INDEX}/slug/${slug}`);
    return {
      status: 'success',
      message: 'Fetch shop details success.',
      data: res.data.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getDetailShopById = async (id: number): Promise<ApiResponse> => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.SHOP.INDEX}/${id}`);
    return {
      status: 'success',
      message: 'Fetch shop details success.',
      data: res.data.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getDetailShopMe = async (): Promise<ApiResponse> => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.SHOP.INDEX}/me/detail`);
    return {
      status: 'success',
      message: 'Fetch shop details success.',
      data: res.data.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    throw error;
  }
};

export const registerSeller = async (data: FormData): Promise<ApiResponse> => {
  try {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.SHOP.INDEX}/register`,
      data,
    );
    return {
      status: 'success',
      message: 'Register seller success.',
      data: res.data.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    throw error;
  }
};
