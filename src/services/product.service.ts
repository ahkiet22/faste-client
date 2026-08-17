import { API_ENDPOINT } from '@/configs/api';
import { ApiResponse } from '@/types/api-response';
import { TBodyCreateProduct } from '@/types/product';
import axiosInstance from '@/utils/axios';
import axios from 'axios';

// enpoint public
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

export const getAllProductsPublicByShop = async (
  id: number,
  params: { page?: number; limit?: number } = { page: 1, limit: 12 },
): Promise<ApiResponse> => {
  try {
    const res = await axios.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.PUBLIC_SHOP}/${id}`,
      {
        params,
      },
    );

    return {
      status: 'success',
      message: 'Fetch product by shop success.',
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
      message: 'Unable to fetch product by shop. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
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

// enpoint for seller or admin
export const createProductBySeller = async (data: TBodyCreateProduct) => {
  try {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}`,
      data,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`,
    );

    console.log('GET DETAILS', res.data);

    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateProductBySeller = async (
  id: string,
  data: Partial<TBodyCreateProduct>,
) => {
  try {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`,
      { data },
    );

    return res.data;
  } catch (error) {
    return error;
  }
};
