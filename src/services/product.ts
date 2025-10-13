import { API_ENDPOINT } from '@/configs/api';
import axiosInstance from '@/utils/axios';
import axios from 'axios';

export const getAllProductsPublic = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 12 },
) => {
  try {
    const res = await axios.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.PUBLIC}`,
      {
        params,
      },
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDetailProductPublicBySlug = async (slugId: string) => {
  try {
    const res = await axios.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.PUBLIC}/slug/${slugId}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllProductPublicBySeller = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 15 },
) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}`,
      { params },
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
