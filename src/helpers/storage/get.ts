import { KEY_STORAGE } from '@/constants/key-storage';

export const getLocalUserData = () => {
  if (typeof window != 'undefined') {
    return {
      userData: window.localStorage.getItem(KEY_STORAGE.USER_DATA),
      accessToken: window.localStorage.getItem(KEY_STORAGE.ACCESS_TOKEN),
    };
  }

  return {
    userData: '',
    accessToken: '',
  };
};

export const getCheckoutItems = (): any[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEY_STORAGE.CHECKOUT_ITEMS);
  return data ? JSON.parse(data) : [];
};

export const getStoreSearchHistory = (): any[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEY_STORAGE.SEARCH_HISTORY);
  return data ? JSON.parse(data) : [];
};
