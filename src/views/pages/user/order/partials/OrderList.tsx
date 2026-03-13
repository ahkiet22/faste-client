'use client';

import { memo, useId } from 'react';
import OrderCard from './order-card';
import { Card } from '@/components/ui/card';
import { randomBytes } from 'crypto';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationWithLinks } from '@/components/pagination-table';

interface OrderListProps {
  orders: any;
  handleProductRating: (id: number) => void;
  handleConfirnReceived: (id: number) => void;
}

function EmptyOrder() {
  return (
    <Card className="p-12 text-center flex flex-col items-center gap-4">
      <p className="text-gray-500 text-lg">No orders found</p>

      <Link href="/products">
        <Button className="mt-2">Go shopping</Button>
      </Link>
    </Card>
  );
}

const OrderList = memo(function OrderList({
  orders,
  handleProductRating,
  handleConfirnReceived,
}: OrderListProps) {
  const uniqueId = useId();
  return (
    <div className="min-h-[600px] mx-auto">
      {!orders || orders.length === 0 ? (
        <EmptyOrder />
      ) : (
        <div className="space-y-4">
          {orders &&
            orders.map((order: any, index: number) => (
              <OrderCard
                key={
                  order?.orders[0]?.id + order?.transactionId + randomBytes(4)
                }
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
