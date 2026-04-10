import { API_ENDPOINT } from '@/configs/api';
import axiosInstance from '@/utils/axios';

const BASE_URL = API_ENDPOINT.PROVINCES.INDEX;

interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

// --- COUNTRY ---
export const getCountryById = async (countryCode: string) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// --- STATES / PROVINCES (s) ---
export const getStates = async (
  countryCode: string,
  params?: PaginationParams,
) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/s`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getStateById = async (countryCode: string, id: string) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/s/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// --- CITIES (c) ---
export const getCities = async (
  countryCode: string,
  params?: PaginationParams,
) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/c`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCityById = async (countryCode: string, id: string) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/c/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// --- DISTRICTS (d) ---
export const getDistricts = async (
  countryCode: string,
  params?: PaginationParams,
) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/d`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getDistrictById = async (countryCode: string, id: string) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/d/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// --- WARDS (w) ---
export const getWards = async (
  countryCode: string,
  params?: PaginationParams,
) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/w`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getWardById = async (countryCode: string, id: string) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${countryCode}/w/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
