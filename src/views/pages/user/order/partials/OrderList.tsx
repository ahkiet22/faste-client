'use client';

import { memo, useId } from 'react';
import OrderCard from './order-card';
import { Card } from '@/components/ui/card';
import { randomBytes } from 'crypto';

interface OrderListProps {
  orders: any;
  handleProductRating: (id: number) => void;
  handleConfirnReceived: (id: number) => void;
}

const OrderList = memo(function OrderList({
  orders,
  handleProductRating,
  handleConfirnReceived
}: OrderListProps) {
  const uniqueId = useId();
  return (
    <div className="min-h-[600px] mx-auto">
      {!orders || orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </Card>
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
    </div>
  );
});

export default OrderList;
