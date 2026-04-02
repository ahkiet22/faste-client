'use client';

import { useGetCategories } from '@/hooks/api/queries/useGetCategories';
import { keepPreviousData } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { SkeletonCardCategory } from './SkeletonCardCategory';
import { PackageOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyCategory = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="w-12 h-12 text-muted-foreground mb-4" />

      <h3 className="text-lg font-semibold mb-2">No categories found</h3>

      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        There are currently no product categories available.
      </p>

      <Link href="/products" className="text-sm text-primary hover:underline">
        Browse all products
      </Link>
    </div>
  );
};

const CardCategory = () => {
  const { data, isLoading } = useGetCategories(
    {
      page: 1,
      limit: 10,
    },
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );
  const { t } = useTranslation();
  if (isLoading) {
    return <SkeletonCardCategory />;
  }
  return (
    <>
      <div className="bg-white dark:bg-black w-full mb-5">
        <p className="text-gray-400 py-2 px-4 uppercase">
          {t('navigation.categories')}
        </p>
        {data ? (
          <div className="flex flex-wrap w-full">
            {data
              .slice(0, window.innerWidth <= 768 ? 8 : 20)
              .map((item: any, index: number) => (
                <Link
                  href={'/product?categoryIds=' + item.id}
                  key={item.id + index + 'skeleton'}
                  className={`
                    flex flex-col items-center justify-between p-2 h-40
                    bg-white dark:bg-black border-gray-200
                    ${index === data.length - 1 || index === 0 ? 'border' : ' border border-l-0'}
                    w-1/4 sm:w-1/4 md:w-1/5 lg:w-1/5 // Responsive width based on screen size
                    hover:shadow-xl
                    transform transition duration-300 ease-in-out
                  `}
                >
                  <div className="rounded-full bg-[#F5F5F5] w-[83px] h-[83px]">
                    <Image
                      src={item.image ? item.image : '/vercel.svg'}
                      width={100}
                      height={100}
                      alt="category image"
                    />
                  </div>
                  <div className="text-wrap max-w-[100px] text-center text-sm">
                    {item.name}
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          EmptyCategory()
        )}
      </div>
    </>
  );
};

export default CardCategory;
