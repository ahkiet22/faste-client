import CartProduct from '@/components/CardProduct';
import CardCategory from './partials/CardCategory';
import { Button } from '@/components/ui/button';
import BannerWeb from './partials/BannerWeb';

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
        <div className="bg-white dark:bg-black w-full mb-4">
          <div className="text-center uppercase text-base font-medium text-red-400 py-2 w-full">
            Sản phẩm mới
          </div>
          <div className="bg-red-500 h-1 w-full"> </div>
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
    </>
  );
};

export default HomePage;
