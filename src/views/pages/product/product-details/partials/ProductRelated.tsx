'use client';

import CartProduct from '@/components/CardProduct';

interface ProductProps {
  products: any[];
}
export const ProductRelated = ({ products }: ProductProps) => {
  return (
    <div className="flex flex-col gap-y-4  dark:bg-black w-full">
      <div className="uppercase font-medium bg-white p-4">Sản phẩm tương tự</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {products ? (
          products.map((product, index) => (
            <CartProduct key={index} data={product} />
          ))
        ) : (
          <div>Not found</div>
        )}
      </div>
    </div>
  );
};
