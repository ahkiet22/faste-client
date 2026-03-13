import { API_ENDPOINT } from '@/configs/api';
import {
  TAdminCategoryListParams,
  TCreateCategoryInput,
  TUpdateCategoryInput,
} from '@/types/admin/category';
import axiosInstance from '@/utils/axios';

export const getAdminCategories = async (params?: TAdminCategoryListParams) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.MANAGE_PRODUCT.CATEGORY.INDEX}`,
      {
        params,
      },
    );
    return res.data;
  } catch (error) {
    console.error('Error getting admin categories:', error);
    throw new Error('Unable to fetch categories. Please try again later.');
  }
};

export const createCategory = async (data: TCreateCategoryInput) => {
  try {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.MANAGE_PRODUCT.CATEGORY.INDEX}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Unable to create category. Please try again later.');
  }
};

export const updateCategory = async (
  id: number,
  data: TUpdateCategoryInput,
) => {
  try {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.MANAGE_PRODUCT.CATEGORY.INDEX}/${id}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Unable to update category. Please try again later.');
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const res = await axiosInstance.delete(
      `${API_ENDPOINT.MANAGE_PRODUCT.CATEGORY.INDEX}/${id}`,
    );
    return res.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Unable to delete category. Please try again later.');
  }
};
