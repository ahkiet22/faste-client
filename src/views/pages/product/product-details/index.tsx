'use client';

import { toastify } from '@/components/ToastNotification';
import { addToCart } from '@/services/cart';
import { getAllProductsPublic } from '@/services/product';
import { Icon } from '@iconify/react';
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  use,
  Suspense,
} from 'react';
import { ImageGallery } from './partials/ImageGallery';
import { useCartStore } from '@/stores/cart-store';
import { ProductRelated } from './partials/ProductRelated';
import CartProductSkeleton from '@/components/skeleton/CartProductSkeleton';
import { ShopInfo } from './partials/ShopInfo';
import { ProductInfo } from './partials/ProductInfo';
import { AddToCartSection } from './partials/AddToCartSection';
import { VariantSelector } from './partials/VariantSelector';
import { ProductSpecs } from './partials/ProductSpecs';
import { ProductReviews } from './partials/ProductReviews';

type TProps = {
  product: any;
};

const ProductDetails = (props: TProps) => {
  const { product } = props;
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [quantityProduct, setQuantityProduct] = useState<number>(1);
  const { setTotalCartItem, totalCartItem } = useCartStore();

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
      toastify.error('Server', 'Server error!');
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

  // ** Handle select variant option
  const handleSelect = useCallback((variantName: string, option: string) => {
    setSelected((prev) => {
      if (prev[variantName] === option) {
        const newState = { ...prev };
        delete newState[variantName];
        return newState;
      }
      return { ...prev, [variantName]: option };
    });
  }, []);

  const handleAddToCart = async () => {
    try {
      const res = await addToCart({
        skuId: matchedSku.id,
        quantity: quantityProduct,
      });

      if (res.status === 201 || res.statusCode === 201) {
        setTotalCartItem(totalCartItem + quantityProduct);
        toastify.success('Thành công', 'Thêm vào giỏ hàng thành công!');
      } else {
        toastify.info('Thông tin', `Đã có lỗi xảy ra vui lòng thử lại!`);
      }
    } catch (error) {
      console.log(error);
      toastify.error('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };
  // const handleAddToCart = useCallback(async () => {
  //   try {
  //     const res = await addToCart({
  //       skuId: matchedSku.id,
  //       quantity: quantityProduct,
  //     });

  //     if (res.status === 201 || res.statusCode === 201) {
  //       setTotalCartItem(totalCartItem + quantityProduct);
  //       toastify.success('Thành công', 'Thêm vào giỏ hàng thành công!');
  //     } else {
  //       toastify.info('Thông tin', `Đã có lỗi xảy ra vui lòng thử lại!`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toastify.error('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
  //   }
  // }, [matchedSku, quantityProduct]);

  if (!product) {
    return <div>Product not found</div>;
  }

  console.log('render product details');

  function collectProductImages(product: any): string[] {
    const productImages = product.images.filter(Boolean);
    const skuImages = product.skus
      .map((sku: { image: string }) => sku.image)
      .filter(Boolean);
    return [...productImages, ...skuImages];
  }

  const allImages = collectProductImages(product);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-start justify-between gap-x-8 bg-white dark:bg-black w-full p-4">
        <div className="w-2/5">
          <ImageGallery images={allImages} productName={product.name} />
        </div>
        <div className="w-3/5 space-y-2">
          <ProductInfo
            product={product}
            matchedSku={matchedSku}
            totalSold={totalSold}
          />

          {product.skus &&
            product.skus.length &&
            product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selected={selected}
                onSelect={handleSelect}
              />
            )}

          <AddToCartSection
            matchedSku={matchedSku}
            quantity={quantityProduct}
            setQuantity={setQuantityProduct}
            onAddToCart={handleAddToCart}
            variantsLength={product.variants.length}
            selectedLength={Object.keys(selected).length}
          />
        </div>
      </div>
      <ShopInfo shop={product.shop} />

      <ProductSpecs product={product} totalSold={totalSold} />

      <div className="bg-white dark:bg-black w-full p-4">
        <div className="flex items-center justify-between bg-gray-50">
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
        <div
          className="py-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      <ProductReviews />
      <Suspense
        fallback={Array.from({ length: 10 }).map((_, i) => (
          <CartProductSkeleton key={i} />
        ))}
      >
        <ProductRelated products={products} />
      </Suspense>
    </div>
  );
};

export default ProductDetails;
