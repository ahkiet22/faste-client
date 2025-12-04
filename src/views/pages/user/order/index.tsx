'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import OrderCard from './partials/order-card';
import { getAllOrdersByUser } from '@/services/order';
import { PaymentMethods } from '@/enums';
import { randomBytes } from 'crypto';

type PaymentFieldType = {
  id: number;
  orderId: number;
  transactionId: number | null;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

type ShopFieldType = {
  name: string;
  slug: string;
};

type OrderDataType = {
  id: number;
  userId: number;
  status: string;
  shopId: number;
  addressShipId: number;
  paymentMethod: PaymentMethods;
  paymentId: number;
  Shop: ShopFieldType;
  Payment: PaymentFieldType;
  items: any[];
  [key: string]: any;
};

const tabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'shipping', label: 'Vận chuyển' },
  { value: 'receive', label: 'Chờ giao hàng' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'returns', label: 'Trả hàng/Hoàn tiền' },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<OrderDataType[] | null>(null);

  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch =
  //     order.shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.items[0].productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.id.toString().includes(searchQuery);
  //   if (activeTab === 'all') return matchesSearch;
  //   return matchesSearch && order.status === activeTab;
  // });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'text-orange-600';
      case 'completed':
        return 'text-gray-600';
      case 'shipping':
        return 'text-gray-600';
      case 'pending':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  function groupOrdersForUI(orders: OrderDataType[]) {
    const groups = orders.reduce(
      (acc, order) => {
        const transactionId = order.Payment?.transactionId;
        const isPending = order.status === 'PENDING_PAYMENT';
        const paymentStatus = order.Payment?.status;
        const paymentMethod = order.paymentMethod !== 'COD';

        if (
          transactionId &&
          isPending &&
          paymentStatus === 'PENDING' &&
          paymentMethod
        ) {
          if (!acc[`tx-${transactionId}`]) {
            acc[`tx-${transactionId}`] = {
              transactionId,
              paymentStatus,
              orders: [],
              totalAmount: 0,
              createdAt: order.Payment.createdAt,
            };
          }
          acc[`tx-${transactionId}`].orders.push(order);
          acc[`tx-${transactionId}`].totalAmount += order.Payment.amount || 0;
        } else {
          acc[`order-${order.id}`] = {
            transactionId: null,
            paymentStatus,
            orders: [order],
            totalAmount: order.Payment?.amount || 0,
            createdAt: order.Payment?.createdAt,
          };
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(groups);
  }

  console.log('ORDER RENDER');

  const fetchDataOrders = async () => {
    try {
      const res = await getAllOrdersByUser();
      // console.log('res orders', groupOrdersForUI(res.data.data));
      // console.log('res orders', res, groupOrdersForUI(res.data.data));
      setOrders(groupOrdersForUI(res.data.data) as any);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-gray-50 space-y-2">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200">
        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:shadow-none data-[state=active]:text-orange-600 text-gray-600 hover:text-orange-600 px-4 py-3 font-medium text-sm "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100 border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="min-h-[600px] mx-auto">
        {orders && orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders &&
              orders.map((order, index) => (
                <OrderCard
                  key={
                    order.orders[0].id + order.transactionId + randomBytes(4)
                  }
                  order={order}
                />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
