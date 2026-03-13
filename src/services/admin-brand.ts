import { API_ENDPOINT } from '@/configs/api';
import {
  TAdminBrandListParams,
  TCreateBrandInput,
  TUpdateBrandInput,
} from '@/types/admin/brand';
import axiosInstance from '@/utils/axios';

export const getAdminBrands = async (params?: TAdminBrandListParams) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.BRAND.INDEX}`,
      {
        params,
      },
    );
    return res.data;
  } catch (error) {
    console.error('Error getting admin brands:', error);
    throw new Error('Unable to fetch brands. Please try again later.');
  }
};

export const createBrand = async (data: TCreateBrandInput) => {
  try {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.MANAGE_PRODUCT.BRAND.INDEX}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw new Error('Unable to create brand. Please try again later.');
  }
};

export const updateBrand = async (id: number, data: TUpdateBrandInput) => {
  try {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.MANAGE_PRODUCT.BRAND.INDEX}/${id}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw new Error('Unable to update brand. Please try again later.');
  }
};

export const deleteBrand = async (id: number) => {
  try {
    const res = await axiosInstance.delete(
      `${API_ENDPOINT.MANAGE_PRODUCT.BRAND.INDEX}/${id}`,
    );
    return res.data;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw new Error('Unable to delete brand. Please try again later.');
  }
};
