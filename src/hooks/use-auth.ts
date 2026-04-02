'use client';

import { useAuthStore } from '@/stores/auth.store';
import { TLoginAuth, TRegisterAuth } from '@/types/auth';
import { loginAuth, logoutAuth, registerAuth } from '@/services/auth';
import {
  setLocalAccessToken,
  setLocalUserData,
  clearLocalUserData,
  clearCheckoutItems,
} from '@/helpers/storage';
import { toastify } from '@/components/ToastNotification';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTE_CONFIG } from '@/configs/router';
import { QUERY_KEYS } from '@/constants/query-keys';

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = async (data: TLoginAuth) => {
    setLoading(true);
    try {
      const response = await loginAuth(data);
      const { accessToken } = response.data;

      setLocalAccessToken(accessToken);

      try {
        const { getProfile } = await import('@/services/profile');
        const profileRes = await getProfile();
        setUser(profileRes.data);
        setLocalUserData(profileRes.data);
      } catch (err) {
        console.error('Failed to fetch profile after login', err);
      }

      toastify.success('Login', 'Login successfully!');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });

      const searchParams =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search)
          : null;
      const returnUrl = searchParams?.get('returnUrl');
      router.replace(returnUrl && returnUrl !== '/' ? returnUrl : '/');
    } catch (error: any) {
      if (error.response?.status === 400) {
        toastify.error('Login', 'Email or password invalid!');
      } else {
        toastify.error(
          'Server Error',
          'Something went wrong. Please try again later.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: TRegisterAuth) => {
    setLoading(true);
    try {
      const response = await registerAuth(data);
      console.log(response);
      if (response.statusCode === 201) {
        toastify.success('Success', 'Your account has been registered!');
      }
      router.replace(ROUTE_CONFIG.LOGIN);
    } catch (error: any) {
      if (error.response?.status === 400) {
        toastify.error(
          'Server Error',
          'Something went wrong. Please try again later.',
        );
      } else {
        toastify.error(
          'Server Error',
          'Something went wrong. Please try again later.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutAuth();
      if (res.statusCode === 201) {
        toastify.success('Logout', 'Logout successfully');
      }
    } catch (error) {
      toastify.error('Logout', 'Something went wrong');
    } finally {
      setUser(null);
      clearLocalUserData();
      clearCheckoutItems();
      router.push('/');
    }
  };

  const loginGoogle = async () => {
    console.log('Login with Google');
  };

  const loginFacebook = async () => {
    console.log('Login with Facebook');
  };

  return {
    user,
    loading,
    setUser,
    setLoading,
    login,
    register,
    logout,
    loginGoogle,
    loginFacebook,
  };
};
