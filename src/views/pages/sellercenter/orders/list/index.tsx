'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getOrdersByShop } from '@/services/order.service';
import { toastify } from '@/components/ToastNotification';
import { iconsStatusOrder } from '@/configs/order';

import { OrderListSkeleton } from './partials/OrderListSkeleton';
import { OrderFilterBar } from './partials/OrderFilterBar';
import { OrderTable } from './partials/OrderTable';
import { OrderCardList } from './partials/OrderCardList';
import { OrderPagination } from './partials/OrderPagination';
import { Order } from '@/types/order';

export default function OrderListPage() {
  const { t } = useTranslation();

  const TAB_OPTIONS = useMemo(
    () => [
      { value: 'ALL', label: t('order.tabs.all') },
      { value: 'PENDING_CONFIRMATION', label: t('order.tabs.pending') },
      { value: 'PROCESSING', label: t('order.tabs.shipping') },
      { value: 'PENDING_PAYMENT', label: t('order.tabs.pending') },
      { value: 'PENDING_PICKUP', label: t('order.tabs.receive') },
      { value: 'PENDING_DELIVERY', label: t('order.tabs.receive') },
      { value: 'DELIVERED', label: t('order.tabs.completed') },
      { value: 'RETURNED', label: t('order.tabs.returns') },
      { value: 'CANCELLED', label: t('order.tabs.cancelled') },
    ],
    [t],
  );

  const PAYMENT_METHODS = useMemo(
    () => [
      { value: 'ALL', label: t('sellercenter.orders.paymentMethods.all') },
      { value: 'COD', label: t('sellercenter.orders.paymentMethods.cod') },
      {
        value: 'BANK_TRANSFER',
        label: t('sellercenter.orders.paymentMethods.bankTransfer'),
      },
      {
        value: 'CREDIT_CARD',
        label: t('sellercenter.orders.paymentMethods.creditCard'),
      },
    ],
    [t],
  );

  const [selectedTab, setSelectedTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ordersData, setOrdersData] = useState<Order[]>([]);

  const pageSize = 10;

  const fetchDataOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getOrdersByShop();
      if (res.status === 'error') {
        toastify.error('error', res.message);
      } else {
        setOrdersData(res.data?.data || []);
      }
    } catch {
      toastify.error('error', 'Không thể lấy danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataOrder();
  }, [fetchDataOrder]);

  const filteredOrders = useMemo(() => {
    let filtered = [...ordersData];

    if (selectedTab !== 'ALL') {
      filtered = filtered.filter((order) => order.status === selectedTab);
    }

    if (paymentMethodFilter !== 'ALL') {
      filtered = filtered.filter(
        (order) => order.paymentMethod === paymentMethodFilter,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(query) ||
          order.Shop.name.toLowerCase().includes(query) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(query),
          ),
      );
    }

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return filtered;
  }, [selectedTab, searchQuery, paymentMethodFilter, ordersData]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const handleResetPage = useCallback(() => setCurrentPage(1), []);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Icon
          icon={iconsStatusOrder.clipboardList}
          className="text-3xl text-gray-700"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t('sellercenter.orders.title')}
        </h1>
      </div>

      {/* Filter Controls */}
      <OrderFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentMethodFilter={paymentMethodFilter}
        setPaymentMethodFilter={setPaymentMethodFilter}
        paymentMethods={PAYMENT_METHODS}
        onFilterChange={handleResetPage}
      />

      {/* Main Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={(val) => {
          setSelectedTab(val);
          handleResetPage();
        }}
        className="w-full"
      >
        <TabsList className="w-full flex-wrap h-auto justify-start gap-2 bg-white py-2">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6 space-y-4">
          {isLoading ? (
            <OrderListSkeleton rowCount={10} />
          ) : (
            <OrderTable orders={paginatedOrders} />
          )}
          <OrderCardList orders={paginatedOrders} onViewDetails={() => {}} />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalFilteredCount={filteredOrders.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
