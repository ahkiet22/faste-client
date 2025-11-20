import { KEY_STORAGE } from '@/constants/key-storage';
import { UserDataType } from '@/types/auth';

export const setLocalUserData = (data: UserDataType) => {
  if (typeof window != 'undefined') {
    window.localStorage.setItem(KEY_STORAGE.USER_DATA, JSON.stringify(data));
  }
};

export const setLocalAccessToken = (accessToken: string) => {
  if (typeof window != 'undefined') {
    window.localStorage.setItem(KEY_STORAGE.ACCESS_TOKEN, accessToken);
  }
};

export const setCheckoutItems = (items: any[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      KEY_STORAGE.CHECKOUT_ITEMS,
      JSON.stringify(items),
    );
  }
};

export const setStoreSearchHistory = (items: any[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      KEY_STORAGE.SEARCH_HISTORY,
      JSON.stringify(items),
    );
  }
};
