'use client';

import { memo } from 'react';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';

type Props = {
  product: any;
  matchedSku: any;
  totalSold: number;
};

export const ProductInfo = memo(({ product, matchedSku, totalSold }: Props) => {
  const { i18n, t } = useTranslation();

  const displayPrice = matchedSku?.price ?? product.basePrice;

  return (
    <div>
      <h1 className="text-xl font-[450]">{product.name}</h1>

      <div className="flex items-center gap-x-2 gap-y-1 my-2 flex-wrap">
        <Rating defaultValue={product.rating ?? 0} readOnly className="gap-x-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton className="text-yellow-500" key={index} size={12} />
          ))}
        </Rating>
        <div className="hidden sm:block h-4 w-[1px] bg-gray-400" />
        <span className="text-sm">{product.ratingCount ?? 0} {t('product.reviews')}</span>
        <div className="h-4 w-[1px] bg-gray-400" />
        <span className="text-sm">{t('product.sold')}: {product.sold ?? totalSold}</span>
      </div>

      <p className="text-xl font-semibold mt-4">
        {formatCurrencyWithExchange(displayPrice, {
          language: i18n.language as 'vi' | 'en' | 'cn' | 'kr',
        })}
      </p>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';
