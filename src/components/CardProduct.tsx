'use client';

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Rating, RatingButton } from './ui/shadcn-io/rating';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const CartProduct = (props: { data: any; className?: string }) => {
  const { data, className = '' } = props;
  const { i18n } = useTranslation();
  return (
    // h-[350px] w-[280px]
    <Link href={`/product/${data.slugId}`}>
      <Card
        className={`rounded-none bg-white dark:bg-black max-w-80 h-72 hover:shadow-accent-foreground text-xs gap-y-1 p-0 border-none transition-all duration-300 ease-in-out overflow-hidden ${className}`}
      >
        <CardContent className="p-0 h-full">
          <div>
            <Image
              src={!!data.images[0] ? data.images[0] : '/nftt-1.png'}
              width={190}
              height={190}
              alt={data.name}
              className="w-full h-[190px]"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
          <div className="p-1">
            <p className="line-clamp-2 text-sm">{data.name}</p>
            <div className="flex items-center gap-x-1">
              <div className="text-[#EE4D2D] text-base">
                {formatCurrencyWithExchange(data.basePrice, {
                  language: i18n.language as 'vi' | 'en',
                })}
              </div>
              <div className="w-8 h-4 text-[10px] bg-[#FEEEEA] text-[#EE4D2D] py-0.5 px-1 ">
                -39%
              </div>
            </div>
            <div>
              <Rating defaultValue={3} readOnly className="gap-x-0">
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton
                    className="text-yellow-500"
                    key={index}
                    size={12}
                  />
                ))}
              </Rating>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CartProduct;
