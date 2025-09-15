import { API_ENDPOINT } from '@/configs/api';
import { TLoginAuth } from '@/types/auth';
import axios from 'axios';

export const loginAuth = async (data: TLoginAuth) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data);

  return res.data;
};
