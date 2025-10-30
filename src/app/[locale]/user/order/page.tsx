import type React from 'react';
import { Metadata } from 'next';
import OrdersPage from '@/views/pages/user/order';

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi | FastE'
}

export default function Page() {
  return <OrdersPage />;
}
