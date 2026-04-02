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
      <div className="grid grid-cols-12 gap-2 bg-background">
        <div className="col-span-2 bg-card py-2">
          <div className="font-semibold py-2 px-4 flex items-center gap-x-2">
            <Icon icon="fluent:align-left-16-regular" width="16" height="16" />
            <span>Danh mục</span>
          </div>
          <div className="flex flex-col">
            <div className="overflow-hidden cursor-pointer hover:bg-gray-200 py-1 px-4 text-sm">
              Sản phẩm
            </div>
            {categories.map((category, index) => (
              <div
                className="overflow-hidden cursor-pointer hover:bg-gray-200 py-1 px-4 text-sm"
                key={index + category}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-10 space-y-2">
          <div className="flex space-x-4 items-center bg-card px-4 py-2">
            <span className="font-semibold">Sắp xếp theo:</span>
            <button className="px-2 py-1 hover:bg-gray-200 rounded">
              Phổ biến
            </button>
            <button className="px-2 py-1 hover:bg-gray-200 rounded">
              Mới nhất
            </button>
            <button className="px-2 py-1 hover:bg-gray-200 rounded">
              Bán chạy
            </button>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="asc">Giá: Thấp đến cáo</SelectItem>
                  <SelectItem value="desc">Giá: Cao đến thấp</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <CartProductSkeleton key={i} />
              ))}
            {dataProducts ? (
              dataProducts.map((product: any, index: number) => (
                <CartProduct key={index} data={product} />
              ))
            ) : (
              <div>Not found</div>
            )}
          </div>
        </div>
      </div>
  );
};
