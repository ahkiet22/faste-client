'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCardCategory = () => {
  return (
    <div className="bg-white dark:bg-black w-full mb-5">
      <p className="text-gray-400 py-2 px-4 uppercase">Category</p>

      <div className="flex flex-wrap w-full bg-gray-200 animate-pulse">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`w-[10%]
              h-40
              flex flex-col items-center justify-between
              p-2
              bg-white
              dark:bg-black
              ${index === 10 || index === 0 ? 'border' : ' border border-l-0'}
              border-gray-200`}
          >
            <Skeleton className="rounded-full w-[83px] h-[83px]" />
            <Skeleton className="h-4 w-3/4 rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
