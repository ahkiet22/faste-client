import CartProduct from '@/components/CardProduct';
import CardCategory from './partials/CardCategory';
import { Button } from '@/components/ui/button';
import BannerWeb from './partials/BannerWeb';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Card } from '@/components/ui/card';
import PrimaryProductCard from './partials/PrimaryProductCard';
import Image from 'next/image';

interface TProps {
  data: [];
  totalItem: number;
  page: number;
  limit: number;
  totalPage: number;
}

const HomePage = (props: TProps) => {
  const { data: products, limit, page, totalItem, totalPage } = props;
  return (
    <>
      <div className="container mx-auto max-w-6xl px-4">
        <BannerWeb />
        <CardCategory />

        {/* Best Sellers Section */}
        <div className="w-full mb-5">
          <div className="bg-white dark:bg-black w-full mb-4">
            <div className="text-center uppercase text-base font-medium text-red-400 py-2 w-full flex justify-center items-center gap-2">
              <Icon icon="mingcute:fire-line" width="24" height="24" />
              Sản phẩm bán chạy
            </div>
            <div className="bg-red-500 h-1 w-full"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 items-stretch">
            {/* Primary product card */}
            <div className="col-span-2">
              <Card className="rounded-none bg-white dark:bg-black max-h-[261.19px] h-full w-full hover:shadow-accent-foreground text-xs gap-y-1 p-0 border-none transition-all duration-300 ease-in-out overflow-hidden">
                <PrimaryProductCard />
              </Card>
            </div>

            {/* Other products */}
            {products ? (
              products.map((product, index) => (
                <CartProduct key={index} data={product} />
              ))
            ) : (
              <div>Not found</div>
            )}
          </div>
        </div>

        {/* New Products Section */}
        <div className="w-full">
          <div className="bg-white dark:bg-black w-full mb-4">
            <div className="text-center uppercase text-base font-medium text-red-400 py-2 w-full">
              Sản phẩm mới
            </div>
            <div className="bg-red-500 h-1 w-full"></div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {products.map((product, index) => (
                <CartProduct key={index} data={product} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="font-normal bg-transparent text-blue-400 border border-blue-400 rounded-none px-40 cursor-pointer"
              >
                Xem Thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
