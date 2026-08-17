'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { iconsStatusOrder } from '@/configs/order';
import { useTranslation } from 'react-i18next';

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  totalFilteredCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function OrderPagination({
  currentPage,
  totalPages,
  totalFilteredCount,
  pageSize,
  onPageChange,
}: OrderPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        {t('sellercenter.orders.pagination.showing', {
          start: Math.min((currentPage - 1) * pageSize + 1, totalFilteredCount),
          end: Math.min(currentPage * pageSize, totalFilteredCount),
          total: totalFilteredCount,
        })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Icon icon={iconsStatusOrder.chevronLeft} className="mr-1" />
          {t('sellercenter.orders.pagination.prev')}
        </Button>

        <span className="text-sm font-medium">
          {t('sellercenter.orders.pagination.page', {
            current: currentPage,
            total: totalPages,
          })}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          {t('sellercenter.orders.pagination.next')}
          <Icon icon={iconsStatusOrder.chevronRight} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}