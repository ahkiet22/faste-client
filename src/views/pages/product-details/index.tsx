'use client';

import CartProduct from '@/components/CardProduct';
import InputNumberCustom from '@/components/InputNumberCustom';
import { ToastNotifications } from '@/components/ToastNotification';
import { Button } from '@/components/ui/button';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { getAllProductsPublic } from '@/services/product';
import { formatCurrencyWithExchange } from '@/utils';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState, useMemo, useCallback, useEffect, use } from 'react';
import { set } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type TProps = {
  product: any;
};

type TVariant = {
  value: string;
  options: string[];
};

const ProductDetails = (props: TProps) => {
  const { product } = props;
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [quantityProduct, setQuantityProduct] = useState<number>(1);
  const { i18n } = useTranslation();

  // ** Calculate total sold
  const totalSold = useMemo(() => {
    return (
      product?.skus?.reduce(
        (acc: any, sku: { sold: any }) => acc + sku.sold,
        0,
      ) || 0
    );
  }, [product?.skus]);

  const fetchDataProducts = async () => {
    try {
      const response = await getAllProductsPublic({ page: 1, limit: 12 });
      setProducts(response?.data.data || []);
    } catch (error) {
      ToastNotifications.error('Server', 'Server error!');
    }
  };

  useEffect(() => {
    fetchDataProducts();
  }, []);

  // ** Find matched SKU
  const matchedSku = useMemo(() => {
    if (!product?.skus || Object.entries(selected).length === 0) return null;

    return product.skus.find((sku: any) => {
      return Object.entries(selected).every(
        ([key, val]) => sku.attributes[key] === val,
      );
    });
  }, [product?.skus, selected]);

  if (!product) {
    return <div>Product not found</div>;
  }

  // **  Calculate total sold
  // function handleTotalSold(skus: any): number {
  console.log('render product details');
  //   return skus.reduce((acc: any, sku: { sold: number }) => acc + sku.sold, 0);
  // }

  // ** Handle select variant option
  const handleSelect = (variantName: string, option: string) => {
    setSelected((prev) => {
      if (prev[variantName] === option) {
        const newState = { ...prev };
        delete newState[variantName];
        return newState;
      }
      return { ...prev, [variantName]: option };
    });
  };

  console.log('ProductDetails -> product', product);
  // console.log('skus attributes', product.skus[0].attributes);
  // console.log('matchedSku & selected', matchedSku, selected);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-start justify-between gap-x-8 bg-white dark:bg-black w-full p-4">
        <div className="w-2/5">
          <Image
            src={
              'https://salt.tikicdn.com/cache/w750/ts/tikimsp/cb/3f/52/5ed5314cabc00d10d36c789df95b4348.png.webp'
            }
            width={1000}
            height={1000}
            alt={product.name}
            className="w-full rounded-lg my-4"
          />
        </div>
        <div className="w-3/5">
          <h5 className="text-3xl font-bold">{product.name}</h5>
          <div className="flex items-center gap-x-2 my-2">
            <Rating defaultValue={3} readOnly className="gap-x-0">
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingButton
                  className="text-yellow-500"
                  key={index}
                  size={12}
                />
              ))}
            </Rating>
            <div className="h-4 w-[1px] bg-gray-400"></div>
            <div>510 Đánh giá</div>
            <div className="h-4 w-[1px] bg-gray-400"></div>
            <div>Đã bán {totalSold}</div>
          </div>

          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold mt-4">
            {matchedSku ? (
              <span>
                {formatCurrencyWithExchange(matchedSku.price, {
                  language: i18n.language as 'vi' | 'en',
                })}
              </span>
            ) : (
              <span>
                {formatCurrencyWithExchange(product.basePrice, {
                  language: i18n.language as 'vi' | 'en',
                })}
              </span>
            )}
          </p>
          {product.skus &&
            product.skus.length &&
            product.variants.length > 0 &&
            product.variants.map((variant: TVariant, index: number) => (
              <div key={index}>
                <h3 className="font-semibold mb-2">{variant.value}:</h3>
                <div className="flex gap-2 flex-wrap">
                  {variant.options.map((opt: string) => {
                    const isActive = selected[variant.value] === opt;
                    return (
                      <button
                        key={opt}
                        className={`px-3 py-1 border rounded-lg hover:bg-gray-200 ${isActive ? 'bg-red-500 text-white' : 'bg-white'}`}
                        onClick={() => handleSelect(variant.value, opt)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          <div className="mt-4">
            <p className="font-semibold">Kết quả SKU:</p>
            {matchedSku ? (
              <pre className="bg-green-100 p-2 rounded">
                {JSON.stringify(matchedSku, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Chưa match SKU nào</p>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <InputNumberCustom
              setValue={setQuantityProduct}
              value={quantityProduct}
              max={matchedSku?.quantity}
            />
            <div>
              {matchedSku ? `${matchedSku.quantity} sản phẩm có sẵn` : ''}
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              disabled={Object.keys(selected).length < product.variants.length}
              className="bg-red-100 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500"
            >
              <Icon icon="tdesign:cart-add" width="96" height="96" />
              <span className="font-normal">Thêm vào giỏ hàng</span>
            </Button>
            <Button
              variant={'default'}
              disabled={Object.keys(selected).length < product.variants.length}
              className="bg-red-500 hover:bg-red-400"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-4 bg-white dark:bg-black w-full p-4">
        <div>
          <Image
            src={'/nftt-1.png'}
            alt={product.shop.name}
            width={100}
            height={100}
            className="rounded-full w-20 h-20 object-cover object-center"
          />
        </div>
        <div>
          <h3 className="font-medium text-xl">{product.shop.name}</h3>
          <div className="flex items-center gap-x-2">
            <Button variant={'outline'}>
              <Icon icon="tdesign:chat-double-filled" width="24" height="24" />{' '}
              <span>Chat Ngay</span>
            </Button>
            <Button>
              <Icon icon="iconoir:shop" width="24" height="24" />{' '}
              <span>Xem Shop</span>
            </Button>
          </div>
        </div>
        <div className="h-20 w-[1px] bg-gray-200"></div>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-400">Đánh Giá</span>
            <span className="text-sm text-red-500">72K</span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-400">Sản Phẩm</span>
            <span className="text-sm text-red-500">3,6K</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-400">Tham Gia</span>
            <span className="text-sm text-red-500">2 năm trước</span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-400">Người Theo dõi</span>
            <span className="text-sm text-red-500">127,6k</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black w-full p-4 space-y-2">
        <div className="uppercase font-medium mb-2">Chi tiết sản phẩm</div>

        <div className="flex gap-x-4">
          <div className="w-40 text-gray-400">Danh mục:</div>
          <div>{product.categories[0].category.name}</div>
        </div>

        <div className="flex gap-x-4">
          <div className="w-40 text-gray-400">Thương hiệu:</div>
          <div>{product.brand.name}</div>
        </div>

        <div className="flex gap-x-4">
          <div className="w-40 text-gray-400">Số sản phẩm còn lại:</div>
          <div>{totalSold}</div>
        </div>

        <div className="flex gap-x-4">
          <div className="w-40 text-gray-400">Gửi từ:</div>
          <div>
            {product.shop.addressShip.address},{' '}
            {product.shop.addressShip.divisionPath.WARD},{' '}
            {product.shop.addressShip.divisionPath.DISTRICT},{' '}
            {product.shop.addressShip.divisionPath.CITY}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black w-full p-4">
        <div className="flex items-center justify-between">
          <h3 className="uppercase font-medium">Mô tả sản phẩm</h3>
          <div className="flex items-center gap-x-4">
            <span className="text-sm text-gray-400">Chia sẻ:</span>
            <div className="flex items-center gap-x-2">
              <Icon
                icon="bxl:facebook-circle"
                width="32"
                height="32"
                className="text-blue-600"
              />
              <Icon
                icon="ant-design:twitter-circle-filled"
                width="32"
                height="32"
                className="text-blue-400"
              />
              <Icon
                icon="ant-design:linkedin-filled"
                width="32"
                height="32"
                className="text-blue-700"
              />
              <Icon
                icon="ant-design:pinterest-circle-filled"
                width="32"
                height="32"
                className="text-red-500"
              />
            </div>
          </div>
        </div>
        <div>{product.description}</div>
      </div>
      <div className="flex items-start justify-between gap-x-8 bg-white dark:bg-black w-full p-4">
        <div className="uppercase font-medium">Đánh giá sản phẩm</div>
      </div>
      <div className="flex flex-col gap-y-4 bg-white dark:bg-black w-full p-4">
        <div className="uppercase font-medium">Sản phẩm tương tự</div>
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
    </div>
  );
};

export default ProductDetails;
