'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import OrderCard from './partials/order-card';
import { getAllOrdersByUser, updateOrderStatus } from '@/services/order';
import { PaymentMethods } from '@/enums';

import ProductRatingForm from './partials/ProductRatingForm';
import OrderList from './partials/OrderList';
import AlertConfirm from '@/components/AlertConfirm';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { toastify } from '@/components/ToastNotification';

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
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isOpenAlertConfirm, setIsOpenAlertConfirm] = useState<boolean>(false);
  const [selectOrder, setSelectOrder] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // ** Handle function
  const handleProductRating = useCallback((id: number) => {
    console.log('OPEN FORM');
    setSelectOrder(id);
    setIsOpenForm(true);
  }, []);
  const handleConfirnReceived = useCallback((id: number) => {
    console.log('OPEN ALERT');
    setSelectOrder(id);
    setIsOpenAlertConfirm(true);
  }, []);
  const handleSubmitReceived = useCallback(async () => {
    setIsLoading(true);
    const res = await updateOrderStatus(Number(selectOrder), {
      status: 'RECEIVED',
    });
    if (res.status === 'success') {
      // setOrderData({ ...orderData, status: pendingStatus });
      toastify.success('Cập nhật trạng thái thành công!');
      // setOpenStatusDialog(false);
      fetchDataOrders();
    } else {
      toastify.error('Cập nhật trạng thái thất bại!');
    }
    setIsLoading(false);
  }, [selectOrder]);
  const handleColseForm = useCallback(() => {
    setSelectOrder(null);
    setIsOpenForm(false);
  }, []);
  const handleColseAlertConfirm = useCallback(() => {
    setSelectOrder(null);
    setIsOpenAlertConfirm(false);
  }, []);

  const handleSelectOrder = useCallback((id: number) => {
    setSelectOrder(id);
  }, []);

  console.log('ORDER RENDER');

  const fetchDataOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getAllOrdersByUser();
      // console.log('res orders', groupOrdersForUI(res.data.data));
      // console.log('res orders', res, groupOrdersForUI(res.data.data));
      setOrders(groupOrdersForUI(res.data.data) as any);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('fetch');
    fetchDataOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-gray-50 space-y-2">
      {/* Header */}
      {isLoading && <LoadingDialog isLoading={true} />}
      <Suspense fallback={<LoadingDialog isLoading={true} />}>
        <ProductRatingForm
          id={selectOrder}
          open={isOpenForm}
          onClose={handleColseForm}
        />
      </Suspense>
      <Suspense fallback={<LoadingDialog isLoading={true} />}>
        <AlertConfirm
          open={isOpenAlertConfirm}
          onClose={handleColseAlertConfirm}
          onConfirm={handleSubmitReceived}
          description={
            "Shopee sẽ thanh toán số tiền trên cho Người bán. Bạn vui lòng chỉ nhấn 'Xác nhận' khi đã nhận được sản phẩm và sản phẩm không có vấn đề nào."
          }
        />
      </Suspense>
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
      <OrderList
        orders={orders}
        handleProductRating={handleProductRating}
        handleConfirnReceived={handleConfirnReceived}
      />
    </main>
  );
}
