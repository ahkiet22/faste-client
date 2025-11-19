import { API_ENDPOINT } from '@/configs/api';
import { ApiResponse } from '@/types/api-response';
import axiosInstance from '@/utils/axios';

export const getAllWidgets = async (id: number): Promise<ApiResponse> => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.SELLER_STORE.WIDGET}/template/${id}`,
    );

    return {
      status: 'success',
      message: 'Fetch widget by shop success.',
      data: res.data.data,
      error: null,
      errorCode: null,
    };
  } catch (error: any) {
    console.log('error', error);
    const errorMessage =
      error?.response?.data?.message || 'Unknown error occurred';
    const errorCode = error?.response?.status || 500;

    return {
      status: 'error',
      message: 'Unable to fetch widget by shop. Please try again later.',
      data: null,
      error: errorMessage,
      errorCode: errorCode,
    };
  }
};
