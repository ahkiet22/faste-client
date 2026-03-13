import { API_ENDPOINT } from '@/configs/api';
import {
  TAdminRole,
  TAdminPermission,
  TCreateRoleInput,
  TUpdateRoleInput,
} from '@/types/admin/role';
import axiosInstance from '@/utils/axios';

export const getAdminRoles = async () => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.ROLE.INDEX}`);
    return res.data;
  } catch (error) {
    console.error('Error getting admin roles:', error);
    throw new Error('Unable to fetch roles. Please try again later.');
  }
};

export const getRoleById = async (id: number) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.ROLE.INDEX}/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error getting role by id:', error);
    throw new Error('Unable to fetch role details.');
  }
};

export const createRole = async (data: TCreateRoleInput) => {
  try {
    const res = await axiosInstance.post(`${API_ENDPOINT.ROLE.INDEX}`, data);
    return res.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw new Error('Unable to create role.');
  }
};

export const updateRole = async (id: number, data: TUpdateRoleInput) => {
  try {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.ROLE.INDEX}/${id}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw new Error('Unable to update role.');
  }
};

export const deleteRole = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`${API_ENDPOINT.ROLE.INDEX}/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw new Error('Unable to delete role.');
  }
};

export const getAllPermissions = async () => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINT.ROLE.PERMISSION}`);
    return res.data;
  } catch (error) {
    console.error('Error getting permissions:', error);
    throw new Error('Unable to fetch permissions.');
  }
};

export const getRolePermissions = async (id: number) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.ROLE.INDEX}/${id}/permissions`,
    );
    return res.data;
  } catch (error) {
    console.error('Error getting role permissions:', error);
    throw new Error('Unable to fetch role permissions.');
  }
};
