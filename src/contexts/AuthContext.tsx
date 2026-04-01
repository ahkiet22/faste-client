'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  Suspense,
} from 'react';
import { TLoginAuth, TRegisterAuth, UserDataType } from '@/types/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { loginAuth, logoutAuth, registerAuth } from '@/services/auth';
import {
  setLocalAccessToken,
  setLocalUserData,
  getLocalUserData,
  clearCheckoutItems,
  clearLocalUserData,
} from '@/helpers/storage';
import { toastify } from '@/components/ToastNotification';
import { injectAuthDependencies } from '@/utils/axios';
import { useGetProfile } from '@/hooks/api/queries/useGetProfile';
import { keepPreviousData } from '@tanstack/react-query';
import { ROUTE_CONFIG } from '@/configs/router';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

type AuthContextType = {
  user: UserDataType;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserDataType>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (data: TLoginAuth) => void;
  register: (data: TRegisterAuth) => void;
  logout: () => void;
  loginGoogle: () => Promise<void>;
  loginFacebook: () => Promise<void>;
};

const defaultValueProvider: AuthContextType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginGoogle: () => Promise.resolve(),
  loginFacebook: () => Promise.resolve(),
};

export const AuthContext = createContext<AuthContextType>(defaultValueProvider);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathName = usePathname();

  // inject to axios when App mount

  const { userData, accessToken } = getLocalUserData();

  const enabled = !!userData;

  const { data, isLoading, refetch } = useGetProfile({
    enabled,
    select: (data) => data,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!userData && !accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (data) {
      setUser(data);
      setLocalUserData(data);
    }

    if (!isLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, data, isLoading, accessToken]);

  useEffect(() => {
    injectAuthDependencies(router, setUser, pathName);
  }, [router, setUser, pathName]);

  // console.log('Auth Context User:', user);

  const login = async (data: TLoginAuth) => {
    setLoading(true);
    try {
      const response = await loginAuth(data);
      const { accessToken } = response.data;

      setLocalAccessToken(accessToken);
      toastify.success('Login', 'Login successfully!');

      await refetch();

      const returnUrl = searchParams.get('returnUrl');
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

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      setLoading,
      login,
      register,
      logout,
      loginGoogle,
      loginFacebook,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      <Suspense fallback={<LoadingDialog isLoading />}>
        {!loading && children}
      </Suspense>
    </AuthContext.Provider>
  );
};
