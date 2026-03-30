'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import InputNumberCustom from '@/components/InputNumberCustom';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  matchedSku: any;
  quantity: number;
  setQuantity: (value: number) => void;
  onAddToCart: () => void;
  variantsLength: number;
  selectedLength: number;
};

export const AddToCartSection = memo(
  ({
    matchedSku,
    quantity,
    setQuantity,
    onAddToCart,
    variantsLength,
    selectedLength,
  }: Props) => {
    const isDisabled =
      selectedLength < variantsLength || matchedSku?.quantity === 0;
    const {t} = useTranslation();

    return (
      <div className="space-y-4">
        {/* Quantity */}
        <div className="flex items-center gap-4">
          <InputNumberCustom
            setValue={setQuantity}
            value={quantity}
            max={matchedSku?.quantity}
          />
          {matchedSku && (
            <span className="text-gray-500">
              {matchedSku.quantity} {t('product.inStock')}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            disabled={isDisabled}
            onClick={onAddToCart}
            className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors flex-1
            ${isDisabled ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-red-50 text-red-500 border-red-500 hover:bg-red-100'}`}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {t('product.addToCart')}
          </button>
          <button
            disabled={isDisabled}
            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors flex-1
            ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            {t('product.buyNow')}
          </button>
        </div>
      </div>
    );
  },
);

AddToCartSection.displayName = 'AddToCartSection';
