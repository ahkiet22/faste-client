import axiosInstance from '@/utils/axios';
import { API_ENDPOINT } from '@/configs/api';

export type ReportDateRange =
  | 'today'
  | 'last7days'
  | 'last30days'
  | 'thisMonth';

export interface ReportQueryParams {
  dateRange?: ReportDateRange;
  from?: string;
  to?: string;
  limit?: number;
}

export interface SellerOverviewRes {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  totalReturns: number;
}

export interface AdminOverviewRes extends SellerOverviewRes {
  totalCustomers: number;
  totalSellers: number;
}

export interface SalesTrendItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesTrendRes {
  data: SalesTrendItem[];
}

export interface TopProductItem {
  productId: number;
  productName: string;
  image: string;
  totalSold: number;
  totalRevenue: number;
}

export interface TopProductsRes {
  data: TopProductItem[];
}

export interface TopSellerItem {
  shopId: number;
  shopName: string;
  logo: string | null;
  totalRevenue: number;
  totalOrders: number;
}

export interface TopSellersRes {
  data: TopSellerItem[];
}

export const getSellerOverview = async (
  params: ReportQueryParams,
): Promise<SellerOverviewRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/seller/overview`,
    { params },
  );
  return res.data?.data || res.data;
};

export const getSellerSalesTrend = async (
  params: ReportQueryParams,
): Promise<SalesTrendRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/seller/sales-trend`,
    { params },
  );
  return res.data?.data || res.data;
};

export const getSellerTopProducts = async (
  params: ReportQueryParams,
): Promise<TopProductsRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/seller/top-products`,
    { params },
  );
  return res.data?.data || res.data;
};

export const getAdminOverview = async (
  params: ReportQueryParams,
): Promise<AdminOverviewRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/admin/overview`,
    { params },
  );
  return res.data?.data || res.data;
};

export const getAdminSalesTrend = async (
  params: ReportQueryParams,
): Promise<SalesTrendRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/admin/sales-trend`,
    { params },
  );
  return res.data?.data || res.data;
};

export const getAdminTopProducts = async (
  params: ReportQueryParams,
): Promise<TopProductsRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/admin/top-products`,
    { params },
  );
  return res.data?.data || res.data;
};

export const getAdminTopSellers = async (
  params: ReportQueryParams,
): Promise<TopSellersRes> => {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.REPORT.INDEX}/admin/top-sellers`,
    { params },
  );
  return res.data?.data || res.data;
};
