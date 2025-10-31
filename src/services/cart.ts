import { API_ENDPOINT } from '@/configs/api';
import { AddToCartRequest } from '@/types/cart';
import axiosInstance from '@/utils/axios';

/**
 * GET /cart
 * get all item cart by user
 */
export const getCartByMe = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 10 },
) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.CART.INDEX}`, {
      params,
    });

    return res.data;
  } catch (error) {
    return error;
  }
};

/**
 * POST /cart
 * Add item to cart
 */
export const addToCart = async (data: AddToCartRequest) => {
  try {
    const res = await axiosInstance.post(`${API_ENDPOINT.CART.INDEX}`, data);

    return res.data;
  } catch (error) {
    return error;
  }
};
