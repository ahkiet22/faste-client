'use client';

import { memo } from 'react';
import OrderCard from './order-card';
import { Card } from '@/components/ui/card';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationWithLinks } from '@/components/pagination-table';
import { useTranslation } from 'react-i18next';
import OrderCardSkeleton from './OrderCardSkeleton';

interface OrderListProps {
  orders: any;
  isLoading: boolean;
  handleProductRating: (id: number) => void;
  handleConfirnReceived: (id: number) => void;
}

function EmptyOrder() {
  const { t } = useTranslation();
  return (
    <Card className="p-12 text-center flex flex-col items-center gap-4">
      <p className="text-gray-500 text-lg">{t('order.empty')}</p>

      <Link href="/products">
        <Button className="mt-2">{t('order.goShopping')}</Button>
      </Link>
    </Card>
  );
}

const OrderList = memo(function OrderList({
  orders,
  isLoading,
  handleProductRating,
  handleConfirnReceived,
}: OrderListProps) {
  return (
    <div className=" mx-auto">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyOrder />
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <OrderCard
              key={`${order.transactionId}-${order.orders[0]?.id}`}
              order={order}
              handleProductRating={handleProductRating}
              handleConfirnReceived={handleConfirnReceived}
            />
          ))}
        </div>
      )}

      <div className="pt-4 flex w-full justify-center">
        <PaginationWithLinks
          page={1}
          pageSize={10}
          totalCount={100}
          pageSizeSelectOptions={{
            pageSizeOptions: [10, 20, 50],
            pageSizeSearchParam: 'limit',
          }}
        />
      </div>
    </div>
  );
});

export default OrderList;
