'use client';

import { getAllProductsPublicByShop } from '@/services/product';
import { Widget } from '@/types/widget';
import { useEffect, useState } from 'react';
import CartProduct from '../CardProduct';

interface ProductsWidgetProps {
  widget: Widget;
  data?: any;
  shopId?: number | null;
}

export default function ProductsWidget({
  widget,
  data,
  shopId,
}: ProductsWidgetProps) {
  const [dataProducts, setDataProducts] = useState<any[]>([]);
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      basePrice: '29990000',
      slugId: '#',
      images: [''],
    },
    {
      name: 'Samsung Galaxy S24',
      basePrice: '22990000',
      slugId: '#',
      images: [''],
    },
    {
      name: 'MacBook Air M3',
      basePrice: '28990000',
      slugId: '#',
      images: [''],
    },
    {
      name: 'iPad Pro 2024',
      basePrice: '24990000',
      slugId: '#',
      images: [''],
    },
  ];
  const fetchProductByShop = async (shopId: number) => {
    const res = await getAllProductsPublicByShop(shopId);
    console.log('PRODUCT BY SHOP =========', res);
    if (!res.error) {
      setDataProducts(res.data.data);
    }
  };
  useEffect(() => {
    if (shopId) {
      fetchProductByShop(shopId);
    } else {
      setDataProducts(products);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Sản phẩm nổi bật
        </h3>
        <button className="text-xs font-medium text-blue-500">
          Xem tất cả
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {dataProducts ? (
          dataProducts.map((product, index) => (
            <CartProduct key={index} data={product} />
          ))
        ) : (
          <div>Not found</div>
        )}
      </div>
      {/* <div className="grid grid-cols-2 gap-2">
        {products.map((product, index) => (
          <div
            key={index}
            className="rounded-lg border bg-white overflow-hidden"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-4xl">📱</span>
            </div>
            <div className="p-2">
              <h4 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">
                {product.name}
              </h4>
              <div className="mt-1.5 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">{product.rating}</span>
                <span className="text-xs text-gray-400">
                  | Đã bán {product.sold}
                </span>
              </div>
              <div className="mt-1.5">
                <p className="text-sm font-bold text-red-500">
                  ₫{product.price}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  ₫{product.oldPrice}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
