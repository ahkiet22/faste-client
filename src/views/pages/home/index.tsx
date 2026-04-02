'use client';

import CartProduct from '@/components/CardProduct';
import CardCategory from './partials/CardCategory';
import { Button } from '@/components/ui/button';
import BannerWeb from './partials/BannerWeb';
import { Icon } from '@iconify/react';
import { Card } from '@/components/ui/card';
import PrimaryProductCard from './partials/PrimaryProductCard';
import Image from 'next/image';
import WelcomePopup from './partials/WelcomePopup';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import EmptyProductHome from './partials/EmptyProductHome';

interface TProps {
  data: [];
  totalItem: number;
  page: number;
  limit: number;
  totalPage: number;
}

const HomePage = (props: TProps) => {
  const { data: products, limit, page, totalItem, totalPage } = props;
  const router = useRouter();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const bestSelling = products.slice(0, 7);
  const newProducts = products.slice(7);

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4">
        <WelcomePopup />
        <BannerWeb />
        <CardCategory />

        {/* Best Sellers Section */}
        <div className="w-full mb-5">
          <div className="bg-white dark:bg-black w-full mb-4">
            <div className="text-center uppercase text-base font-medium text-red-400 py-2 w-full flex justify-center items-center gap-2">
              <Icon
                icon="mingcute:fire-line"
                width="24"
                height="24"
                suppressHydrationWarning
              />
              {t('product.bestSelling')}
            </div>
            <div className="bg-red-500 h-1 w-full"></div>
          </div>

          {/* Other products */}
          {bestSelling && bestSelling.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 items-stretch">
              {/* Primary product card */}
              <div className="col-span-2">
                <Card className="rounded-none bg-white dark:bg-black max-h-[288px] h-full w-full hover:shadow-accent-foreground text-xs gap-y-1 p-0 border-none transition-all duration-300 ease-in-out overflow-hidden">
                  <PrimaryProductCard />
                </Card>
              </div>

              {bestSelling.map((product: any) => (
                <CartProduct key={product.id} data={product} />
              ))}
            </div>
          ) : (
            <EmptyProductHome />
          )}
        </div>

        <div className="w-full mb-5 rounded-2xl overflow-hidden">
          <Image
            src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/2f/bf/2fbff17f2d97cb69d9d10194b17611aa.png"
            alt="primary product"
            width={1200}
            height={1000}
            className="w-full h-[380px] object-cover"
          />
        </div>

        {/* New Products Section */}
        <div className="w-full">
          <div className="bg-white dark:bg-black w-full mb-4">
            <div className="text-center uppercase text-base font-medium text-red-400 py-2 w-full">
              {t('product.newProducts')}
            </div>
            <div className="bg-red-500 h-1 w-full"></div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            {newProducts && newProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {newProducts.map((product: any, index) => (
                  <CartProduct key={index + product.id} data={product} />
                ))}
              </div>
            ) : (
              <EmptyProductHome />
            )}

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="font-normal bg-transparent text-blue-400 border border-blue-400 rounded-none px-40 cursor-pointer"
                onClick={() => router.push('/product?page=1&limit=20')}
              >
                {t('common.viewMore')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
