'use client';

import CartProduct from '@/components/CardProduct';
import CartProductSkeleton from '@/components/skeleton/CartProductSkeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllProductPublicByShop } from '@/hooks/api/queries/useGetAllProductPublicByShop';
import { getAllProductsPublicByShop } from '@/services/product';
import { Icon } from '@iconify/react';
import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
type TProps = {
  shopId: number;
};
export const AllProducts = (props: TProps) => {
  const { shopId } = props;
  const categories = [
    'Ô Tô - Xe Máy - Xe Đạp',
    'Phụ kiện - Chăm sóc xe',
    'Thiết Bị Số - Phụ Kiện Số',
    'Balo và Vali',
    'Đồ Chơi - Mẹ & Bé',
    'Nhà Cửa - Đời Sống',
    'Túi thời trang nữ',
    'Đồng hồ và Trang sức',
    'Túi thời trang nam',
  ];

  const { data: dataProducts, isLoading } = useGetAllProductPublicByShop(
    shopId,
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );
  return (
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 bg-transparent mt-4">
        {/* Categories Sidebar - Desktop Only */}
        <div className="hidden lg:block lg:col-span-2 bg-white dark:bg-black rounded-lg p-2 h-fit sticky top-20">
          <div className="font-semibold py-2 px-4 flex items-center gap-x-2 border-b border-gray-100 dark:border-gray-800">
            <Icon icon="fluent:align-left-16-regular" width="16" height="16" />
            <span>Danh mục</span>
          </div>
          <div className="flex flex-col mt-2">
            <div className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 py-2 px-4 text-sm rounded-md transition-colors font-medium text-blue-500">
              Tất cả Sản phẩm
            </div>
            {categories.map((category, index) => (
              <div
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 py-2 px-4 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-400"
                key={index + category}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        {/* Categories Horizontal - Mobile Only */}
        <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 pb-2">
          <button className="whitespace-nowrap px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium">
            Tất cả
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className="whitespace-nowrap px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="lg:col-span-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-black px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto no-scrollbar">
            <span className="font-semibold text-sm text-gray-500 mr-2 whitespace-nowrap">Sắp xếp theo:</span>
            <div className="flex gap-2 min-w-0">
              <button className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded transition-colors whitespace-nowrap">
                Phổ biến
              </button>
              <button className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm rounded transition-colors whitespace-nowrap">
                Mới nhất
              </button>
              <button className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm rounded transition-colors whitespace-nowrap">
                Bán chạy
              </button>
              <Select>
                <SelectTrigger className="w-[140px] h-8 text-sm">
                  <SelectValue placeholder="Giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="asc">Giá: Thấp đến cao</SelectItem>
                    <SelectItem value="desc">Giá: Cao đến thấp</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <CartProductSkeleton key={i} />
              ))}
            {dataProducts && dataProducts.length > 0 ? (
              dataProducts.map((product: any, index: number) => (
                <CartProduct key={index} data={product} />
              ))
            ) : !isLoading ? (
              <div className="col-span-full py-20 text-center bg-white dark:bg-black rounded-lg border border-dashed border-gray-300">
                <Icon icon="mdi:package-variant" className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
  );
};
