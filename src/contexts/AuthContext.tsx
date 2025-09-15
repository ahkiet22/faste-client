'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { TLoginAuth } from '@/types/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAuth } from '@/services/auth';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';
import { setLocalUserData } from '@/helpers/storage';
import { ToastNotifications } from '@/components/ToastNotification';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

// Định nghĩa kiểu cho AuthContext
type User = {
  email: string;
  token: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (data: TLoginAuth) => {
    setUser({ email: data.email, token: '' });
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
    router.push('/login');
  };

  const loginGoogle = async () => {
    console.log('Login with Google');
  };

  const loginFacebook = async () => {
    console.log('Login with Facebook');
  };

  const value = {
    user,
    loading,
    setUser,
    setLoading,
    login,
    logout,
    loginGoogle,
    loginFacebook,
  };

  return (
    <AuthContext.Provider value={value}>
      <LoadingDialog isLoading={loading} />
      {children}
    </AuthContext.Provider>
  );
};
