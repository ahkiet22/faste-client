'use client';

import CartProduct from '@/components/CardProduct';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSearchStore } from '@/stores/useSearchStore';
import { getSearchProduct } from '@/services/search';
import { TParamsSearch } from '@/types/params';
import CartProductSkeleton from '@/components/skeleton/CartProductSkeleton';
import ProductNotFound from './ProductNotFound';

export const ProductListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchText } = useSearchStore();

  const [searchProducts, setSearchProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = {
    order: searchParams.get('order') || '',
    orderBy: searchParams.get('orderBy') || '',
    rating: searchParams.get('rating') || '',
    categoryIds: searchParams.get('categoryIds') || '',
    brands: searchParams.get('brands') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    router.replace(`?${params.toString()}`);
  };

  const fetchProduct = async (params: TParamsSearch) => {
    try {
      const res = await getSearchProduct(params);
      setSearchProducts(res.data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct({
      keyword: searchText,
      order: filters.order ? (filters.order as 'asc' | 'desc') : 'asc',
      // rating: Number(filters.rating),
      // categoryIds: filters.categoryIds,
    });
    // chạy lại mỗi lần URL params thay đổi
  }, [searchParams]);

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="w-full grid grid-cols-12 space-x-1">
        {/* LEFT FILTER */}
        <div className="col-span-2 space-y-4 pr-4">
          <div className="flex justify-between items-center">
            <Icon icon={'line-md:filter'} className="text-lg" />
            <h2 className="text-lg font-medium">Bộ lọc tiềm kiếm</h2>
          </div>
          <div className="space-y-2">
            <div className="text-sm">Nơi bán</div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Hà Nội
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Hồ Chí Minh
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Đà Nẵng
                </Label>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          {/* Category  */}
          <div className="space-y-2">
            <div className="text-sm">Theo danh mục</div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Tivi
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Máy tính
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Phụ kiện
                </Label>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          {/* Đơn vị vận chuyển */}
          <div className="space-y-2">
            <div className="text-sm">Đơn vị vận chuyển</div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Hỏa tốc
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Nhanh
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Tiết kiệm
                </Label>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          {/* Thương hiệu */}
          <div className="space-y-2">
            <div className="text-sm">Thương hiệu</div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Samsung
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  LG
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal!">
                  Sony
                </Label>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200" />
          {/* Theo Giá  */}
          <div className="space-y-2">
            {' '}
            <div className="text-sm">Khoảng giá</div>
            <div className="w-full flex items-center gap-x-2">
              <input
                type="number"
                value={10}
                onChange={(e) => {}}
                placeholder="từ"
                step={1}
                min={10}
                max={100}
                className="h-[30px] w-20 text-center [appearance:textfield] outline-none border border-gray-400
          [&::-webkit-inner-spin-button]:appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="w-4 h-[1px] bg-gray-400"></span>
              <input
                type="number"
                value={10000000}
                onChange={(e) => {}}
                placeholder="đến"
                step={1}
                min={10}
                max={100}
                className="h-[30px] w-20 text-center [appearance:textfield] outline-none border border-gray-400
          [&::-webkit-inner-spin-button]:appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <Button className="w-full bg-red-500 rounded-none hover:bg-red-400">
              ÁP DỤNG
            </Button>
          </div>{' '}
          <div className="w-full h-[1px] bg-gray-200" />
          {/* Theo đánh giá  */}
          <div className="space-y-2">
            <div className="text-sm">Đánh giá</div>
            <div className="pl-4 space-y-1">
              {[5, 4, 3, 2, 1].map((item) => (
                <div
                  key={item}
                  className="flex items-center space-x-1 cursor-pointer! py-0.5"
                  onClick={() => updateFilter('rating', String(item))}
                >
                  <Rating defaultValue={item} readOnly className="gap-x-0">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton
                        className="text-yellow-500"
                        key={index}
                        size={12}
                      />
                    ))}
                  </Rating>

                  {item !== 5 && <span className="text-sm">trở lên</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>
          {/* Clear all */}
          <Button
            className="w-full bg-red-500 rounded-none hover:bg-red-400"
            onClick={() => router.replace('?')}
          >
            XÓA TẤT CẢ
          </Button>
        </div>

        {/* RIGHT PRODUCT LIST */}
        <div className="col-span-10 space-y-2">
          {/* SORT */}
          <div className="mb-4 flex items-center gap-x-2">
            <Icon icon="stash:light-bulb-exclamation" width="28" height="28" />
            <span>Kết quả tìm kiếm cho từ khoá</span>
            <span className="text-red-500">{`'${searchText}'`}</span>
          </div>
          <div className="flex space-x-4 items-center bg-card px-4 py-2">
            <span className="font-semibold">Sắp xếp theo:</span>

            <button
              className="px-2 py-1 hover:bg-gray-200 rounded"
              onClick={() => updateFilter('orderBy', 'popular')}
            >
              Phổ biến
            </button>

            <button
              className="px-2 py-1 hover:bg-gray-200 rounded"
              onClick={() => updateFilter('orderBy', 'new')}
            >
              Mới nhất
            </button>

            <button
              className="px-2 py-1 hover:bg-gray-200 rounded"
              onClick={() => updateFilter('orderBy', 'bestseller')}
            >
              Bán chạy
            </button>

            <Select
              value={filters.order}
              onValueChange={(v) => updateFilter('or.order', v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="asc">Giá: Thấp → cao</SelectItem>
                  <SelectItem value="desc">Giá: Cao → thấp</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* PRODUCT GRID */}
          <div className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 items-stretch">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <CartProductSkeleton key={i} />
              ))
            ) : searchProducts.length > 0 ? (
              searchProducts.map((product, index) => (
                <CartProduct key={index} data={product} />
              ))
            ) : (
              <div className='absolute top-0 left-0 w-full'>
                <ProductNotFound />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
