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
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useSearchStore } from '@/stores/useSearchStore';
import { getSearchProduct } from '@/services/search';
import { TParamsSearch } from '@/types/params';
import CartProductSkeleton from '@/components/skeleton/CartProductSkeleton';
import ProductNotFound from './ProductNotFound';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { ProductFilter } from './partials/ProductFilter';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

import page from '@/app/[locale]/sellercenter/vouchers/list/page';

type TSearchProducts = {
  total: number;
  page: number;
  limit: number;
  products: any[];
};

export const ProductListPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchText } = useSearchStore();

  const [searchProducts, setSearchProducts] = useState<TSearchProducts>({
    total: 0,
    page: 1,
    limit: 12,
    products: [],
  });
  const [loading, setLoading] = useState(true);

  const filters = {
    order: searchParams.get('order') || '',
    orderBy: searchParams.get('orderBy') || '',
    rating: searchParams.get('rating') || '',
    categoryIds: searchParams.get('categoryIds') || '',
    brands: searchParams.get('brands') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '20',
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
      setSearchProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct({
      keyword: searchText,
      order: filters.order ? (filters.order as 'asc' | 'desc') : 'asc',
      // rating: Number(filters.rating),
      page: Number(filters.page),
      limit: Number(filters.limit),
      categoryIds: filters.categoryIds,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // console.log('==== PRODUCT RENDER');

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilter updateFilter={updateFilter} router={router} />
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 space-y-4">
            {/* MOBILE HEADER & FILTER TRIGGER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="stash:light-bulb-exclamation"
                  width="24"
                  height="24"
                  className="text-gray-400"
                />
                <h1 className="text-sm md:text-base font-medium">
                  {t('search.searchResults')} <span className="text-red-500">{`'${searchText}'`}</span>
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 h-9 px-4 border-gray-200">
                      <Filter className="w-4 h-4" />
                      {t('search.filterTitle')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto pt-10">
                    <SheetHeader className="mb-4">
                      <SheetTitle className="text-left">{t('search.filterTitle')}</SheetTitle>
                    </SheetHeader>
                    <ProductFilter updateFilter={updateFilter} router={router} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* SORT BAR - Better Responsive Scroll */}
            <div className="bg-card shadow-sm border border-gray-100 px-4 py-2 rounded-lg flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 flex-wrap flex-1">
                <span className="text-sm font-semibold whitespace-nowrap">{t('search.sortBy')}:</span>
                
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar py-1">
                  {[
                    { label: t('search.popular'), value: 'popular' },
                    { label: t('search.newest'), value: 'new' },
                    { label: t('search.bestseller'), value: 'bestseller' }
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      className={`px-4 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap border
                        ${filters.orderBy === btn.value 
                          ? 'bg-red-500 text-white border-red-500 shadow-sm' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => updateFilter('orderBy', btn.value)}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                value={filters.order}
                onValueChange={(v) => updateFilter('order', v)}
              >
                <SelectTrigger className="w-full md:w-[180px] h-9 border-gray-200">
                  <SelectValue placeholder={t('search.price')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="asc">{t('search.priceAsc')}</SelectItem>
                    <SelectItem value="desc">{t('search.priceDesc')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* PRODUCT GRID */}
            <div className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 items-stretch min-h-[400px]">
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <CartProductSkeleton key={i} />
                ))
              ) : searchProducts.products.length > 0 ? (
                searchProducts.products.map((product, index) => (
                  <CartProduct key={index} data={product} />
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center">
                  <ProductNotFound />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
};
