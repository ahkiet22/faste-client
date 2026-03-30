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
import { useTranslation } from 'react-i18next';

type TProps = {
  product: any;
};

const getShareUrl = (type: string, url: string) => {
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent('Share this product!');
  const image = encodeURIComponent('https://your-site.com/og.png');

  switch (type) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'x':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${image}&description=${text}`;
    default:
      return '#';
  }
};

const ProductDetails = (props: TProps) => {
  const { product } = props;
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [quantityProduct, setQuantityProduct] = useState<number>(1);
  const { setTotalCartItem, totalCartItem } = useCartStore();
  const { t } = useTranslation();

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
        toastify.success(t('common.status.success'), t('product.messages.addSuccess'));
      } else {
        toastify.info(t('common.status.info'), t('product.messages.somethingWrong'));
      }
    } catch (error) {
      console.log(error);
      toastify.error(t('common.status.error'), t('product.messages.addError'));
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
    return <div>{t('common.notFound')}</div>;
  }

  console.log('render product details');

  function collectProductImages(product: any): string[] {
    const productImages = product.images.filter(Boolean);
    const skuImages = product.skus
      .map((sku: { image: string }) => sku.image)
      .filter(Boolean);
    return [...productImages, ...skuImages];
  }

  const url =
    typeof window !== 'undefined' ? window.location.href : 'https://faste.com';

  const socials = [
    {
      type: 'facebook',
      icon: 'bxl:facebook-circle',
      color: 'text-blue-600',
      label: 'Share Facebook',
    },
    {
      type: 'x',
      icon: 'ri:twitter-x-fill',
      color: 'text-black',
      label: 'Share X',
    },
    {
      type: 'linkedin',
      icon: 'ant-design:linkedin-filled',
      color: 'text-blue-700',
      label: 'Share LinkedIn',
    },
    {
      type: 'pinterest',
      icon: 'ant-design:pinterest-circle-filled',
      color: 'text-red-500',
      label: 'Share Pinterest',
    },
  ];

  const allImages = collectProductImages(product);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 bg-white dark:bg-black w-full p-4">
        <div className="w-full lg:w-2/5">
          <ImageGallery images={allImages} productName={product.name} />
        </div>
        <div className="w-full lg:w-3/5 space-y-4">
          <ProductInfo
            product={product}
            matchedSku={matchedSku}
            totalSold={totalSold}
          />

          {product.skus &&
            product.skus.length > 0 &&
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
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-2 md:p-0">
          <h3 className="uppercase font-medium mb-2 md:mb-0">{t('product.description')}</h3>
          <div className="flex items-center gap-x-4">
            <span className="text-sm text-gray-400">{t('common.share')}:</span>
            <div className="flex items-center gap-x-2 flex-wrap">
              {socials.map((item) => (
                <a
                  key={item.type}
                  href={getShareUrl(item.type, url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="transition-transform hover:scale-110"
                >
                  <Icon
                    icon={item.icon}
                    width="32"
                    height="32"
                    className={item.color}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          className="py-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      <ProductReviews product={product} />
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
