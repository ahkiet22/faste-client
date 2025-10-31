'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from './cart-item';
import { ChevronRight } from 'lucide-react';

interface ShopSectionProps {
  CartShop: any;
  onQuantityChange: (id: number, skuId: number, quantity: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number, selected: boolean) => void;
  onSelectAll: (shopId: number, selected: boolean) => void;
}

export function ShopSection({
  CartShop,
  onQuantityChange,
  onDelete,
  onSelect,
  onSelectAll,
}: ShopSectionProps) {
  const allSelected = CartShop.cartItems.every((item: any) => item.isSelected);
  // const someSelected = shop.items.some((item) => item.isSelected);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Shop Header */}
      <div className="bg-card p-4 border-b border-border flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) =>
            onSelectAll(CartShop.shop.shopid, checked as boolean)
          }
        />
        <div className="flex items-center gap-2 flex-1">
          <span className="font-semibold text-foreground">
            {CartShop.shop.name}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Promotions */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 px-4 py-2 border-b border-border">
        <p className="text-xs text-yellow-700 dark:text-yellow-600">
          Free Ship Extra
        </p>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-border">
        {CartShop.cartItems.map((item: any) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
