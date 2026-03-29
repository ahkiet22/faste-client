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
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { OrderStatus } from '@/types/order';

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

export default function OrdersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { value: OrderStatus | ''; label: string }[] = [
    { value: '', label: t('order.tabs.all') },

    { value: 'PENDING_CONFIRMATION', label: t('order.tabs.pending') },
    { value: 'PENDING_DELIVERY', label: t('order.tabs.shipping') },
    { value: 'DELIVERED', label: t('order.tabs.receive') },
    { value: 'RECEIVED', label: t('order.tabs.completed') },
    { value: 'CANCELLED', label: t('order.tabs.cancelled') },
    { value: 'RETURNED', label: t('order.tabs.returns') },
  ];

  const [activeTab, setActiveTab] = useState<OrderStatus | ''>('');
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
    setSelectOrder(id);
    setIsOpenForm(true);
  }, []);
  const handleConfirnReceived = useCallback((id: number) => {
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
      toastify.success(t('order.updateSuccess'));
      // setOpenStatusDialog(false);
      fetchDataOrders();
    } else {
      toastify.error(t('order.updateFailed'));
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleChangeTab = (value: string) => {
    setActiveTab(value as OrderStatus | '');
  };

  const fetchDataOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getAllOrdersByUser({
        page: 1,
        limit: 10,
        status: activeTab || undefined,
      });
      setOrders(groupOrdersForUI(res.data.data) as any);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);


  return (
    <main className="bg-background space-y-2">
      {/* Header */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProductRatingForm
          id={selectOrder}
          open={isOpenForm}
          onClose={handleColseForm}
        />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <AlertConfirm
          open={isOpenAlertConfirm}
          onClose={handleColseAlertConfirm}
          onConfirm={handleSubmitReceived}
          description={t('order.confirmReceivedDescription')}
        />
      </Suspense>
      <div className="sticky top-0 bg-background border-b border-border">
        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={handleChangeTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0 overflow-x-auto overflow-y-hidden scrollbar-hide">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:shadow-none data-[state=active]:text-orange-600 text-muted-foreground hover:text-orange-600 px-4 py-3 font-medium text-sm "
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder={t('order.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <OrderList
        orders={orders}
        isLoading={isLoading}
        handleProductRating={handleProductRating}
        handleConfirnReceived={handleConfirnReceived}
      />
    </main>
  );
}
