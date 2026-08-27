import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import {
  getSellerOverview,
  getSellerSalesTrend,
  getSellerTopProducts,
  getAdminOverview,
  getAdminSalesTrend,
  getAdminTopProducts,
  getAdminTopSellers,
  ReportQueryParams,
} from '@/services/report.service';

export const useGetSellerOverview = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_OVERVIEW_REPORT, params],
    queryFn: () => getSellerOverview(params),
  });
};

export const useGetSellerSalesTrend = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_TREND_REPORT, params],
    queryFn: () => getSellerSalesTrend(params),
  });
};

export const useGetSellerTopProducts = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_TOP_PRODUCTS_REPORT, params],
    queryFn: () => getSellerTopProducts(params),
  });
};

export const useGetAdminOverview = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_OVERVIEW_REPORT, params],
    queryFn: () => getAdminOverview(params),
  });
};

export const useGetAdminSalesTrend = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_TREND_REPORT, params],
    queryFn: () => getAdminSalesTrend(params),
  });
};

export const useGetAdminTopProducts = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_TOP_PRODUCTS_REPORT, params],
    queryFn: () => getAdminTopProducts(params),
  });
};

export const useGetAdminTopSellers = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_TOP_SELLERS_REPORT, params],
    queryFn: () => getAdminTopSellers(params),
  });
};
