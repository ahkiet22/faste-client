'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { toastify } from '@/components/ToastNotification';
import { addToCart } from '@/services/cart.service';
import { useCartStore } from '@/stores/cart.store';
import { AddToCartSection } from './partials/AddToCartSection';
import { ImageGallery } from './partials/ImageGallery';
import { ProductInfo } from './partials/ProductInfo';
import { VariantSelector } from './partials/VariantSelector';
import { calculateTotalSold, findMatchingSKU } from './product-detail.helpers';
import type { ProductDetail, ProductSKU } from './product-detail.types';

type Props = {
  product: Pick<
    ProductDetail,
    | 'name'
    | 'basePrice'
    | 'rating'
    | 'ratingCount'
    | 'totalViews'
    | 'sold'
    | 'variants'
    | 'skus'
  >;
  images: string[];
};

const EMPTY_SKUS: ProductSKU[] = [];
const EMPTY_VARIANTS: NonNullable<ProductDetail['variants']> = [];

export default function ProductPurchaseClient({ product, images }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { setTotalCartItem, totalCartItem } = useCartStore();
  const { t } = useTranslation();
  const skus = product.skus ?? EMPTY_SKUS;
  const variants = product.variants ?? EMPTY_VARIANTS;
  const totalSold = useMemo(() => calculateTotalSold(skus), [skus]);
  const matchedSku = useMemo(
    () => findMatchingSKU(skus, selected) as ProductSKU | null,
    [selected, skus],
  );

  const handleSelect = useCallback((variantName: string, option: string) => {
    setSelected((current) => {
      if (current[variantName] !== option) {
        return { ...current, [variantName]: option };
      }
      const next = { ...current };
      delete next[variantName];
      return next;
    });
  }, []);

  const handleAddToCart = async () => {
    if (!matchedSku || isAdding) return;
    setIsAdding(true);
    try {
      const response = await addToCart({ skuId: matchedSku.id, quantity });
      if (response.status === 201 || response.statusCode === 201) {
        setTotalCartItem(totalCartItem + quantity);
        toastify.success(
          t('common.status.success'),
          t('product.messages.addSuccess'),
        );
      } else {
        toastify.info(
          t('common.status.info'),
          t('product.messages.somethingWrong'),
        );
      }
    } catch {
      toastify.error(
        t('common.status.error'),
        t('product.messages.addError'),
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-start justify-between gap-6 bg-white p-4 dark:bg-black lg:flex-row lg:gap-8">
      <div className="w-full lg:w-2/5">
        <ImageGallery images={images} productName={product.name} />
      </div>
      <div className="w-full space-y-4 lg:w-3/5">
        <ProductInfo
          product={product}
          matchedSku={matchedSku}
          totalSold={totalSold}       
        />
        {skus.length > 0 && variants.length > 0 ? (
          <VariantSelector
            variants={variants}
            selected={selected}
            onSelect={handleSelect}
          />
        ) : null}
        <AddToCartSection
          matchedSku={matchedSku}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          variantsLength={variants.length}
          selectedLength={Object.keys(selected).length}
          isPending={isAdding}
        />
      </div>
    </div>
  );
}
