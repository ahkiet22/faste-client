import { API_ENDPOINT } from '@/configs/api';
import axiosInstance from '@/utils/axios';

export const getAllImagesInDB = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 100 },
) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.MEDIA.INDEX}`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllImagesInCloud = async (
  params: { page?: number; limit?: number } = { page: 1, limit: 100 },
) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.MEDIA.ALL}`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file: File, isPublic = true) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', String(isPublic));
    const res = await axiosInstance.post(
      `${API_ENDPOINT.MEDIA.UPLOAD}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const uploadMultipleFiles = async (files: File[], isPublic = false) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('isPublic', String(isPublic));
    const res = await axiosInstance.post(
      `${API_ENDPOINT.MEDIA.UPLOAD_MULTIPLE}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
