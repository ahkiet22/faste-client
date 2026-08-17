'use client';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { iconsStatusOrder, statusToColor, statusToLabel } from '@/configs/order';
import { formatCurrency } from '@/helpers/currency';
import { Order } from '@/types/order';

interface OrderCardListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

export function OrderCardList({ orders, onViewDetails }: OrderCardListProps) {
  const { t } = useTranslation();

  if (orders.length === 0) {
    return (
      <Card className="md:hidden">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Icon icon={iconsStatusOrder.package} className="text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500">{t('sellercenter.orders.empty')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-semibold">
                  {t('sellercenter.orders.table.orderLabel')} #{order.id}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
              <Badge variant="outline" className={statusToColor(order.status)}>
                {statusToLabel(order.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon icon={iconsStatusOrder.package} className="text-gray-400" />
              <span className="text-gray-600">{order.Shop.name}</span>
            </div>

            <div className="text-sm text-gray-600">
              {t('sellercenter.orders.table.itemsCount', {
                count: order.items.length,
              })}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Icon icon={iconsStatusOrder.payment} className="text-gray-400" />
              <span className="text-gray-600">{order.paymentMethod}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('sellercenter.orders.table.total')}:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(order.Payment.amount)}
              </span>
            </div>

            <Button onClick={() => onViewDetails(order)} className="w-full" variant="outline">
              <Icon icon={iconsStatusOrder.eye} className="mr-2" />
              {t('sellercenter.orders.viewDetails')}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}