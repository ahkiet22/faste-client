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

    console.log('SHOPS', res.data);
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;
    return {
      status: 'error',
      message: 'Unable to fetch shop data. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
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
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;
    return {
      status: 'error',
      message: 'Unable to fetch shop data. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
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
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;

    return {
      status: 'error',
      message: 'Unable to fetch shop details. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
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
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;

    return {
      status: 'error',
      message: 'Unable to fetch shop details. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
  }
};
