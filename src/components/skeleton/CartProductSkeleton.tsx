'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '../ui/card';

export default function CartProductSkeleton({ className = '' }) {
  return (
    <Card
      className={`rounded-none bg-white dark:bg-black max-w-80 h-72 p-0 border-none overflow-hidden ${className}`}
    >
      <CardContent className="p-0 h-full space-y-2">
        {/* Image skeleton */}
        <Skeleton className="w-full h-[190px] rounded-none" />

        <div className="px-1 space-y-2">
          {/* Title skeleton */}
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-8/12" />

          {/* Price + Discount */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center gap-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
