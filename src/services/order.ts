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
