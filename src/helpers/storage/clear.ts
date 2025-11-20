import { KEY_STORAGE } from '@/constants/key-storage';

export const clearLocalUserData = () => {
  if (typeof window != 'undefined') {
    window.localStorage.removeItem(KEY_STORAGE.USER_DATA);
    window.localStorage.removeItem(KEY_STORAGE.ACCESS_TOKEN);
  }
};

export const clearCheckoutItems = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_STORAGE.CHECKOUT_ITEMS);
};

export const clearStoreSearchHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_STORAGE.SEARCH_HISTORY);
};
