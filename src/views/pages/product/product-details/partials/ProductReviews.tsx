import { ProductRating } from '@/components/ProductRating';
import { getAllReviews } from '@/services/review';
import { memo, useState, useEffect } from 'react';
import { ReviewCard } from './ReviewCard';
import { useTranslation } from 'react-i18next';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

export const ProductReviews = memo(({ product }: { product: any }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {t} = useTranslation();

  const fetchReviewsByProduct = async () => {
    if (product) {
      setLoading(true);
      const res = await getAllReviews({
        page: 1,
        limit: 5,
        productId: Number(product.id),
        order: 'asc',
        sortBy: 'createdAt',
        rating: selectedRating !== null ? selectedRating : undefined,
      });
      console.log('fetchReviewsByProduct', res);
      if (res?.data) {
        setReviews(res.data);
      }
      setLoading(false);
    }
  };

  const FILLTER_REVIEW: { value: any; text: string }[] = [
    {
      value: null,
      text: t('common.all'),
    },
    {
      value: 1,
      text: t('common.stars', { count: 1 }),
    },
    {
      value: 2,
      text: t('common.stars', { count: 2 }),
    },
    {
      value: 3,
      text: t('common.stars', { count: 3 }),
    },
    {
      value: 4,
      text: t('common.stars', { count: 4 }),
    },
    {
      value: 5,
      text: t('common.stars', { count: 5 }),
    },
  ];

  useEffect(() => {
    fetchReviewsByProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, selectedRating]);

  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
  };

  return (
    <div className="flex flex-col items-start w-full p-4 bg-white dark:bg-black">
      <div className="uppercase font-medium mb-4">{t('product.reviews')}</div>

      <div className="bg-red-50 w-full mb-4 px-4 py-4 flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="text-red-500 text-xl font-medium">
            <span className="text-3xl">{product.rating}</span> {t('common.outOf5')}
          </div>
          <ProductRating rating={product.rating ?? 0} size={18} />
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {FILLTER_REVIEW.map((item) => (
            <button
              key={item.value + item.text}
              onClick={() =>
                handleRatingFilter(item.value === 0 ? null : item.value)
              }
              className={`${
                selectedRating === (item.value === 0 ? null : item.value)
                  ? 'border border-red-300 bg-white'
                  : 'bg-white text-gray-700 '
              } py-1 px-3 md:px-4 rounded-md text-sm transition-colors hover:bg-gray-50`}
            >
              {`${item.text}`}
            </button>
          ))}
        </div>
      </div>

      {/* Review cards */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} skus={product.skus} />
            ))
          ) : (
            <div className="text-center text-gray-600">{t('common.noReviews')}</div>
          )}
        </div>
      )}
    </div>
  );
});

ProductReviews.displayName = 'ProductReviews';
