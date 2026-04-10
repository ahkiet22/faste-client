import { API_ENDPOINT } from '@/configs/api';
import axiosInstance from '@/utils/axios';
import {
  CreateAddressShipBodyType,
  UpdateAddressShipBodyType,
  AddressShipType,
} from '@/types/address-ship';
import { TPagination } from '@/types/params';

export const addressShipService = {
  getAllAddressShips: async (query?: TPagination) => {
    try {
      const res = await axiosInstance.get(API_ENDPOINT.ADDRESS_SHIP.INDEX, {
        params: query,
      });
      return res.data;
    } catch (error) {
      console.error('Error getting all address ships:', error);
      throw error;
    }
  },

  createAddressShip: async (body: CreateAddressShipBodyType) => {
    try {
      const res = await axiosInstance.post(
        API_ENDPOINT.ADDRESS_SHIP.INDEX,
        body,
      );
      return res.data;
    } catch (error) {
      console.error('Error creating address ship:', error);
      throw error;
    }
  },

  getAddressShipById: async (id: number | string) => {
    try {
      const res = await axiosInstance.get(
        `${API_ENDPOINT.ADDRESS_SHIP.INDEX}/${id}`,
      );
      return res.data;
    } catch (error) {
      console.error('Error getting address ship by id:', error);
      throw error;
    }
  },

  getAddressShipDefault: async (id: number | string) => {
    try {
      const res = await axiosInstance.get(
        `${API_ENDPOINT.ADDRESS_SHIP.INDEX}/default/${id}`,
      );
      return res.data;
    } catch (error) {
      console.error('Error getting address ship default:', error);
      throw error;
    }
  },

  updateAddressShip: async (
    id: number | string,
    body: UpdateAddressShipBodyType,
  ) => {
    try {
      const res = await axiosInstance.patch(
        `${API_ENDPOINT.ADDRESS_SHIP.INDEX}/${id}`,
        body,
      );
      return res.data;
    } catch (error) {
      console.error('Error updating address ship:', error);
      throw error;
    }
  },

  deleteAddressShip: async (id: number | string) => {
    try {
      const res = await axiosInstance.delete(
        `${API_ENDPOINT.ADDRESS_SHIP.INDEX}/${id}`,
      );
      return res.data;
    } catch (error) {
      console.error('Error deleting address ship:', error);
      throw error;
    }
  },
};

export default addressShipService;
