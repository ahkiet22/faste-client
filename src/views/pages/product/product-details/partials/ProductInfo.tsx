'use client';

import { memo } from 'react';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';

type Props = {
  product: any;
  matchedSku: any;
  totalSold: number;
  totalViews?: number;
};

function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
}

export const ProductInfo = memo(
  ({ product, matchedSku, totalSold, totalViews }: Props) => {
    const { i18n, t } = useTranslation();

    const displayPrice = matchedSku?.price ?? product.basePrice;
    const viewsCount = totalViews ?? product.totalViews ?? product.viewCount ?? 0;

    return (
      <div>
        <h1 className="text-xl font-[450]">{product.name}</h1>

        <div className="my-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Rating defaultValue={product.rating ?? 0} readOnly className="gap-x-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton className="text-yellow-500" key={index} size={12} />
            ))}
          </Rating>
          <div className="hidden h-4 w-[1px] bg-gray-400 sm:block" />
          <span className="text-sm">
            {product.ratingCount ?? 0} {t('product.reviews')}
          </span>
          <div className="h-4 w-[1px] bg-gray-400" />
          <span className="text-sm">
            {t('product.sold')}: {product.sold ?? totalSold}
          </span>
          <div className="h-4 w-[1px] bg-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatCompactNumber(viewsCount)} {t('product.views', 'lượt xem')}
          </span>
        </div>

        <p className="mt-4 text-xl font-semibold">
          {formatCurrencyWithExchange(displayPrice, {
            language: i18n.language as 'vi' | 'en' | 'cn' | 'kr',
          })}
        </p>
      </div>
    );
  },
);

ProductInfo.displayName = 'ProductInfo';