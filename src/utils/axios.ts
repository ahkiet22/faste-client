import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { BASE_URL } from '@/configs/api';
import { getLocalUserData } from '@/helpers/storage/get';
import { refreshToken } from '@/services/auth';
import { setLocalAccessToken } from '@/helpers/storage/set';
import { clearLocalUserData } from '@/helpers/storage/clear';
import { ROUTE_CONFIG } from '@/configs/router';
import { createUrlQuery } from './create-query-url';

let _router: any = null;
let _setUser: any = null;
let _pathName: string | null = null;

export const injectAuthDependencies = (
  router: any,
  setUser: any,
  pathName: string,
) => {
  _router = router;
  _setUser = setUser;
  _pathName = pathName;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ==== QUEUE AVOID PARALLEL REFRESH ====
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// ==== REQUEST INTERCEPTOR ====
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = getLocalUserData();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ==== RESPONSE INTERCEPTOR ====
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalRequest = error.config;

    console.log(error.response?.status);

    if (error.response?.status === 500 && !(originalRequest as any)?._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          console.log(token);
          originalRequest!.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest!);
        });
      }

      (originalRequest as any)!._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshToken();
        setLocalAccessToken(res.data.accessToken);
        processQueue(null, res.data.accessToken);

        originalRequest!.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest!);
      } catch (err) {
        processQueue(err, null);
        clearLocalUserData();

        if (_router) {
          const redirectUrl =
            _pathName !== '/'
              ? ROUTE_CONFIG.LOGIN +
                '?' +
                createUrlQuery('returnUrl', _pathName!)
              : ROUTE_CONFIG.LOGIN;
          _router.replace(redirectUrl);
        }
        if (_setUser) _setUser(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
