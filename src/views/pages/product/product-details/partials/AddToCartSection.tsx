'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import InputNumberCustom from '@/components/InputNumberCustom';
import { ShoppingCart } from 'lucide-react';

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
              {matchedSku.quantity} sản phẩm có sẵn
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={isDisabled}
            onClick={onAddToCart}
            className="bg-red-100 text-red-500 border-red-500 hover:bg-red-50"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Thêm vào giỏ hàng
          </Button>
          <Button disabled={isDisabled} className="bg-red-500 hover:bg-red-400">
            Mua ngay
          </Button>
        </div>
      </div>
    );
  },
);

AddToCartSection.displayName = 'AddToCartSection';
