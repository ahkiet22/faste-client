import { API_ENDPOINT } from '@/configs/api';
import axiosInstance from '@/utils/axios';

export const createOrder = async (data: CreateOrderType) => {
  try {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`,
      data,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllOrdersByUser = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 10 },
) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`,
      { params },
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDetailOrderById = async (id: number) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDetailOrderTXById = async (id: number) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/tx/${id}`,
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const getOrdersByShop = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 10 },
) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/seller`,
      { params },
    );

    return {
      status: 'success',
      message: 'Fetch order by shop success.',
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
      message: 'Unable to fetch order by shop details. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
  }
};
