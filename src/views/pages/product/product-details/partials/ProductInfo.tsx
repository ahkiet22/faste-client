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
  const { i18n } = useTranslation();

  const displayPrice = matchedSku?.price ?? product.basePrice;

  return (
    <div>
      <h1 className="text-xl font-[450]">{product.name}</h1>

      <div className="flex items-center gap-x-2 my-2">
        <Rating defaultValue={3} readOnly className="gap-x-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton className="text-yellow-500" key={index} size={12} />
          ))}
        </Rating>
        <div className="h-4 w-[1px] bg-gray-400" />
        <span>510 Đánh giá</span>
        <div className="h-4 w-[1px] bg-gray-400" />
        <span>Đã bán {totalSold}</span>
      </div>

      <p className="text-xl font-semibold mt-4">
        {formatCurrencyWithExchange(displayPrice, {
          language: i18n.language as 'vi' | 'en',
        })}
      </p>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';
