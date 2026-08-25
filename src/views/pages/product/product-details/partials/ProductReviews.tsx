'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductRating } from '@/components/ProductRating';
import { getAllReviews } from '@/services/review.service';
import type { ProductReview, ProductSKU } from '../product-detail.types';
import { ReviewCard } from './ReviewCard';
import ProductReviewsSkeleton from './ProductReviewsSkeleton';

type Props = {
  productId: number;
  rating: number;
  skus: ProductSKU[];
  initialReviews?: ProductReview[];
};

export function ProductReviews({
  productId,
  rating,
  skus,
  initialReviews = [],
}: Props) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { t } = useTranslation();

  const normalizedInitialReviews: ProductReview[] = Array.isArray(initialReviews)
    ? initialReviews
    : (initialReviews as any)?.items ?? (initialReviews as any)?.data ?? [];

  const { data: reviews = [], isFetching } = useQuery<ProductReview[]>({
    queryKey: ['product-reviews', productId, selectedRating],
    queryFn: async ({ signal }) => {
      const response = await getAllReviews(
        {
          page: 1,
          limit: 5,
          productId,
          order: 'asc',
          sortBy: 'createdAt',
          rating: selectedRating ?? undefined,
        },
        signal,
      );

      const result =
        (response as any)?.data?.items ??
        (response as any)?.data?.data ??
        (response as any)?.items ??
        (response as any)?.data ??
        response;

      return Array.isArray(result) ? (result as ProductReview[]) : [];
    },
    initialData: selectedRating === null ? normalizedInitialReviews : undefined,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const filters = [null, 1, 2, 3, 4, 5] as const;

  return (
    <div className="flex min-h-130 w-full flex-col items-start bg-white p-4 dark:bg-black">
      <div className="mb-4 font-medium uppercase">{t('product.reviews')}</div>
      <div className="mb-4 flex min-h-24 w-full flex-col items-center gap-4 bg-red-50 px-4 py-4 md:flex-row md:items-start">
        <div className="flex shrink-0 flex-col items-center">
          <div className="text-xl font-medium text-red-500">
            <span className="text-3xl">{rating}</span> {t('common.outOf5')}
          </div>
          <ProductRating rating={rating} size={18} />
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          {filters.map((value) => (
            <button
              key={value ?? 'all'}
              type="button"
              onClick={() => setSelectedRating(value)}
              aria-pressed={selectedRating === value}
              className={`${
                selectedRating === value
                  ? 'border border-red-300 bg-white'
                  : 'bg-white text-gray-700'
              } rounded-md px-3 py-1 text-sm transition-colors hover:bg-gray-50 md:px-4`}
            >
              {value === null
                ? t('common.all')
                : t('common.stars', { count: value })}
            </button>
          ))}
        </div>
      </div>
      <div className="relative w-full space-y-4" aria-busy={isFetching}>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} skus={skus} />
          ))
        ) : isFetching ? (
          <ProductReviewsSkeleton />
        ) : (
          <div className="text-center text-gray-600">{t('common.noReviews')}</div>
        )}
      </div>
    </div>
  );
}