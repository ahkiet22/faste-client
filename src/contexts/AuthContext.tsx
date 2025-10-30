'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { TLoginAuth } from '@/types/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { loginAuth } from '@/services/auth';
import { setLocalUserData } from '@/helpers/storage/set';
import { ToastNotifications } from '@/components/ToastNotification';
import { getLocalUserData } from '@/helpers/storage/get';
import { set } from 'react-hook-form';
import { injectAuthDependencies } from '@/utils/axios';
import { useGetProfile } from '@/hooks/queries/useGetProfile';
import { keepPreviousData } from '@tanstack/react-query';

// Định nghĩa kiểu cho AuthContext
type UserDataType = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  avatar: string;
  addresses: any[];
} | null;

type AuthContextType = {
  user: UserDataType;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserDataType>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (data: TLoginAuth) => void;
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

  const { userData } = getLocalUserData();

  const enabled = !!userData;

  const { data, isLoading } = useGetProfile({
    enabled,
    select: (data) => data,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!enabled) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (data) {
      setUser(data);
    }

    // khi react-query load xong thì setLoading = false
    if (!isLoading) {
      setLoading(false);
    }
  }, [enabled, data]);

  useEffect(() => {
    injectAuthDependencies(router, setUser, pathName);
  }, [router, setUser, pathName]);

  console.log('Auth Context User:', user);

  const login = (data: TLoginAuth) => {
    // setUser({ email: data.email });
    loginAuth(data)
      .then((response) => {
        setLocalUserData(response.data.accessToken);
        ToastNotifications.success('Login', 'Login successfully!');
        const returnUrl = searchParams.get('returnUrl');
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';
        router.replace(redirectURL as string);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          ToastNotifications.error('Login', 'Email or password invalid!');
          return;
        }
        ToastNotifications.error('Login', 'Server error!');
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
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
      logout,
      loginGoogle,
      loginFacebook,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
