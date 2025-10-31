'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: any;
  onQuantityChange: (id: number, skuId: number, quantity: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number, selected: boolean) => void;
}

export function CartItem({
  item,
  onQuantityChange,
  onDelete,
  onSelect,
}: CartItemProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  let attributeKeys: string[] = [];
  if (item.sku.attributes) {
    attributeKeys = Object.keys(item.sku.attributes);
  }

  console.log(item);

  return (
    <div className="w-full flex flex-col gap-4 border-b border-border py-4 bg-white">
      {/* Row: Checkbox + Content */}
      <div className="flex items-start gap-4 px-4">
        {/* Checkbox */}
        <Checkbox
          checked={item.isSelected}
          onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          className="mt-2"
        />

        {/* Product Image + Info */}
        <div className="flex gap-4 flex-1">
          <Image
            src={item.sku.image || item.sku.product.images[0]}
            alt={item.sku.product.name.slice(0, 5)}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />

          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-sm font-medium text-foreground line-clamp-2">
              {item.sku.product.name}
            </h3>

            {/* Attributes */}
            <div className="flex flex-wrap gap-2">
              {attributeKeys.map((key) => (
                <span
                  key={key}
                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                >
                  {key}: {item.sku.attributes[key]}
                </span>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">Giao từ 2-4 ngày</p>
          </div>
        </div>

        {/* Giá */}
        <div className="text-right min-w-[110px]">
          <span className="text-lg font-semibold text-destructive">
            {formatPrice(item.sku.price)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="text-center min-w-[120px]">
          <div className="inline-flex items-center gap-2 border border-border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={item.quantity === 1}
              onClick={() =>
                onQuantityChange(
                  item.id,
                  item.skuId,
                  Math.max(1, item.quantity - 1),
                )
              }
              // disabled={}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={item.sku.quantity === item.quantity}
              onClick={() =>
                onQuantityChange(
                  item.id,
                  item.skuId,
                  Math.min(item.sku.quantity, item.quantity + 1),
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[120px] font-semibold">
          {formatPrice(item.sku.price * item.quantity)}
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
