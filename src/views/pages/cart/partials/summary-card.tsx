'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/router';

interface SummaryCardProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  selectedItems: any[];
  onCheckout?: () => void;
  onOrder?: () => void;
}

export function SummaryCard({
  subtotal,
  shipping,
  discount,
  total,
  onCheckout,
  onOrder,
  selectedItems,
}: SummaryCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const pathname = usePathname();

  return (
    <Card className="p-6 sticky top-4 h-fit">
      {/* Delivery Address */}
      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Giao tới
          </h3>
          <button className="text-sm text-primary hover:underline">
            Thay đổi
          </button>
        </div>
        <div className="bg-muted p-3 rounded-lg mb-2">
          <p className="text-sm font-medium text-foreground">Lê Kiệt</p>
          <p className="text-xs text-muted-foreground mt-1">0886206553</p>
          <p className="text-xs text-muted-foreground mt-1">
            499 lê quang định, Phường 01, Quận Gò Vấp, Hồ Chí Minh
          </p>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Promo Code */}
      <div className="">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Mã khuyến mãi
        </h3>
        <div className="flex gap-2">
          <Input placeholder="Nhập mã khuyến mãi" className="text-sm" />
          <Button variant="outline" size="sm">
            Áp dụng
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Price Summary */}
      <div className="space-y-2 ">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tổng tiền hàng</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="text-foreground">{formatPrice(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="text-destructive">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <Separator className="my-2" />

      {/* Total */}
      <div className="">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Tổng tiền thanh toán
          </span>
          <span className="text-2xl font-bold text-destructive">
            {formatPrice(total)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          (Đã bao gồm VAT nếu có)
        </p>
      </div>

      {/* Checkout Button */}
      <Button
        disabled={selectedItems.length <= 0}
        className={`w-full bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-lg mb-4 ${
          selectedItems.length > 0
            ? 'bg-destructive hover:bg-destructive/90 cursor-pointer'
            : 'cursor-not-allowed'
        }`}
        onClick={pathname === ROUTE_CONFIG.CART ? onCheckout : onOrder}
      >
        {`${pathname === ROUTE_CONFIG.CART ? 'Mua hàng' : 'Đặt hàng'} (${selectedItems.length})`}
      </Button>
    </Card>
  );
}
