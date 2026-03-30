'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageCircle, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  shop: any;
};

export const ShopInfo = memo(({ shop }: Props) => {
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-x-4 bg-white dark:bg-black w-full p-4">
      <div className="flex items-center gap-x-4 w-full md:w-auto">
        <Image
          src={shop.logo || '/placeholder.png'}
          alt={shop.name}
          width={80}
          height={80}
          className="rounded-full w-16 h-16 md:w-20 md:h-20 object-cover flex-shrink-0"
        />

        <div className="flex-1">
          <h3 className="font-medium text-lg md:text-xl line-clamp-1">{shop.name}</h3>
          <div className="flex items-center gap-x-2 mt-2">
            <Button variant="outline" size="sm" className="cursor-pointer h-8 px-2 md:px-3 text-xs md:text-sm" >
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {t('shop.chatNow')}
            </Button>
            <Button size="sm" onClick={() => router.push(`/shop/${shop.slug}`)} className='cursor-pointer h-8 px-2 md:px-3 text-xs md:text-sm'>
              <Store className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {t('shop.viewShop')}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block h-16 w-[1px] bg-gray-200 mx-4" />
      <div className="md:hidden w-full h-[1px] bg-gray-100 my-2" />

      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-2 text-sm w-full md:w-auto flex-1">
        <div className="flex justify-between md:justify-start gap-x-2">
          <span className="text-gray-400">{t('product.rating')}</span>
          <span className="text-red-500 font-medium">72K</span>
        </div>
        <div className="flex justify-between md:justify-start gap-x-2">
          <span className="text-gray-400">{t('navigation.products')}</span>
          <span className="text-red-500 font-medium">3,6K</span>
        </div>
        <div className="flex justify-between md:justify-start gap-x-2">
          <span className="text-gray-400">{t('product.joined')}</span>
          <span className="text-red-500 font-medium">2 năm</span>
        </div>
        <div className="flex justify-between md:justify-start gap-x-2">
          <span className="text-gray-400">{t('shop.follow')}</span>
          <span className="text-red-500 font-medium">127,6k</span>
        </div>
      </div>
    </div>
  );
});

ShopInfo.displayName = 'ShopInfo';
