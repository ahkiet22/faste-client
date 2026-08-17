'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { iconsStatusOrder, statusToColor, statusToLabel } from '@/configs/order';
import { formatCurrency } from '@/helpers/currency';
import { Order } from '@/types/order';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="hidden md:block rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead className="w-[100px]">{t('sellercenter.orders.table.orderId')}</TableHead>
            <TableHead>{t('sellercenter.orders.table.createdAt')}</TableHead>
            <TableHead>{t('sellercenter.orders.table.shop')}</TableHead>
            <TableHead>{t('sellercenter.orders.table.product')}</TableHead>
            <TableHead>{t('sellercenter.orders.table.total')}</TableHead>
            <TableHead>{t('sellercenter.orders.table.payment')}</TableHead>
            <TableHead>{t('sellercenter.orders.table.status')}</TableHead>
            <TableHead className="text-right">{t('sellercenter.orders.table.action')}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                {t('sellercenter.orders.empty')}
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50/60 transition-colors">
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell className="text-sm">
                  {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                </TableCell>
                <TableCell className="text-sm font-medium">{order.Shop.name}</TableCell>
                
                <TableCell className="text-sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="outline-none border-none bg-transparent hover:bg-transparent shadow-none cursor-pointer pl-0 text-blue-600 hover:underline"
                        variant="outline"
                      >
                        {t('sellercenter.orders.table.itemsCount', {
                          count: order.items.length,
                        })}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="max-w-xs">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-xs py-0.5">
                          • {item.productName} <span className="font-bold">x{item.quantity || 1}</span>
                        </div>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>

                <TableCell className="font-semibold text-gray-900">
                  {formatCurrency(order.Payment.amount)}
                </TableCell>
                <TableCell className="text-sm">{order.paymentMethod}</TableCell>
                
                <TableCell>
                  <Badge variant="outline" className={statusToColor(order.status)}>
                    {statusToLabel(order.status)}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    onClick={() => router.push(`/sellercenter/orders/detail/${order.id}`)}
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Icon icon={iconsStatusOrder.eye} className="mr-1" />
                    {t('sellercenter.orders.view')}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}