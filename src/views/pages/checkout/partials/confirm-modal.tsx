'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrencyWithExchange } from '@/utils';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  selectedDelivery?: { name: string; estimatedTime: string; cost: number };
  selectedPaymentMethod: string;
  totalAmount: number;
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  selectedDelivery,
  selectedPaymentMethod,
  totalAmount,
}: ConfirmModalProps) {
  const { i18n } = useTranslation();

  console.log("= Confirm model render")

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md border border-border/50 bg-gradient-to-br from-background to-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon
              icon="mdi:check-circle-outline"
              width={24}
              height={24}
              className="text-primary"
            />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">
              Xác nhận đơn hàng
            </DialogTitle>
            <DialogDescription>
              Vui lòng kiểm tra lại thông tin trước khi đặt hàng
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4 py-4">
          {/* Delivery Info */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Giao hàng
            </p>
            <p className="font-medium">{selectedDelivery?.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedDelivery?.estimatedTime}
            </p>
          </div>

          {/* Payment Info */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Thanh toán
            </p>
            <p className="font-medium">{selectedPaymentMethod}</p>
          </div>

          {/* Total */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Tổng cộng
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {formatCurrencyWithExchange(Number(totalAmount), {
                language: i18n.language as 'vi' | 'en',
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-transparent cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer"
          >
            {isLoading ? (
              <Icon
                icon="mdi:loading"
                className="animate-spin"
                width={18}
                height={18}
              />
            ) : (
              'Xác nhận'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
