import { KEY_STORAGE } from '@/constants/key-storage';
import { UserDataType } from '@/types/auth';

/**
 * Memory Cache for Storage
 */
const storageCache = new Map<string, string | null>();

/**
 * Core Utilities
 */
export const getFromCacheOrStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;

  if (storageCache.has(key)) {
    return storageCache.get(key) || null;
  }

  const value = window.localStorage.getItem(key);
  storageCache.set(key, value);

  return value;
};

export const setToCacheAndStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, value);
  storageCache.set(key, value);
};

export const removeFromCacheAndStorage = (key: string) => {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(key);
  storageCache.delete(key);
};

export const clearCacheAndStorage = () => {
  if (typeof window === 'undefined') return;

  window.localStorage.clear();
  storageCache.clear();
};

/**
 * Getters
 */
export const getLocalUserData = () => {
  return {
    userData: getFromCacheOrStorage(KEY_STORAGE.USER_DATA),
    accessToken: getFromCacheOrStorage(KEY_STORAGE.ACCESS_TOKEN),
  };
};

export const getCheckoutItems = (): any[] => {
  const data = getFromCacheOrStorage(KEY_STORAGE.CHECKOUT_ITEMS);
  return data ? JSON.parse(data) : [];
};

export const getStoreSearchHistory = (): any[] => {
  const data = getFromCacheOrStorage(KEY_STORAGE.SEARCH_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const getViewedProduct = (): any[] => {
  const data = getFromCacheOrStorage(KEY_STORAGE.RECENT_VIEWED_PRODUCTS);
  return data ? JSON.parse(data) : [];
};

/**
 * Setters
 */
export const setLocalUserData = (data: UserDataType) => {
  setToCacheAndStorage(KEY_STORAGE.USER_DATA, JSON.stringify(data));
};

export const setLocalAccessToken = (accessToken: string) => {
  setToCacheAndStorage(KEY_STORAGE.ACCESS_TOKEN, accessToken);
};

export const setCheckoutItems = (items: any[]) => {
  setToCacheAndStorage(KEY_STORAGE.CHECKOUT_ITEMS, JSON.stringify(items));
};

export const setStoreSearchHistory = (items: any[]) => {
  setToCacheAndStorage(KEY_STORAGE.SEARCH_HISTORY, JSON.stringify(items));
};

export const setViewedProduct = (items: any[]) => {
  setToCacheAndStorage(
    KEY_STORAGE.RECENT_VIEWED_PRODUCTS,
    JSON.stringify(items),
  );
};

/**
 * Clear functions
 */
export const clearLocalUserData = () => {
  removeFromCacheAndStorage(KEY_STORAGE.USER_DATA);
  removeFromCacheAndStorage(KEY_STORAGE.ACCESS_TOKEN);
};

export const clearCheckoutItems = () => {
  removeFromCacheAndStorage(KEY_STORAGE.CHECKOUT_ITEMS);
};

export const clearStoreSearchHistory = () => {
  removeFromCacheAndStorage(KEY_STORAGE.SEARCH_HISTORY);
};
