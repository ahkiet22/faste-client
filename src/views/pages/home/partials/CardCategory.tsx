'use client';

import { useGetCategories } from '@/hooks/queries/useGetCategories';
import { keepPreviousData } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { SkeletonCardCategory } from './SkeletonCardCategory';

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
  if (isLoading) {
    return <SkeletonCardCategory />;
  }
  return (
    <>
      <div className="bg-white dark:bg-black w-full mb-5">
        <p className="text-gray-400 py-2 px-4 uppercase">Category</p>
        {data ? (
          <div className="flex flex-wrap w-full">
            {data
              .slice(0, window.innerWidth <= 768 ? 8 : 20)
              .map((item: any, index: number) => (
                <Link
                  href={'ok'}
                  key={item.id}
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
          <div>No data</div>
        )}
      </div>
    </>
  );
};

export default CardCategory;
