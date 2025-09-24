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
  console.log(data);
  return (
    <>
      <div className="bg-white dark:bg-black w-full mb-5">
        <p className="text-gray-400 py-2 px-4 uppercase">Category</p>
        {data ? (
          <div className="flex flex-wrap w-full">
            {data.map((item: any, index: number) => (
              <Link
                href={'ok'}
                key={item.id}
                className={`
                flex flex-col items-center justify-between p-2 h-40
                bg-white dark:bg-black border-gray-200
                ${index === data.length || index === 0 ? 'border' : ' border border-l-0'}
                w-[10%]
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
                <div className="text-wrap max-w-24">{item.name}</div>
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
