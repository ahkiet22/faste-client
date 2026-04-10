'use client';

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';
import { getOrdersByShop } from '@/services/order.service';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { addressShipService } from '@/services/address-ship.service';
import { toastify } from '@/components/ToastNotification';
import { OrderStatus } from '@/types/order';
import {
  iconsStatusOrder,
  statusToColor,
  statusToLabel,
} from '@/configs/order';
import { formatCurrency } from '@/helpers/currency';
import { useRouter } from 'next/navigation';

type Order = {
  id: number;
  createdAt: string;
  updatedAt?: string;
  status: OrderStatus;
  paymentMethod: string;
  Payment: {
    id: number;
    transactionId?: number;
    amount: number;
    status: string;
    paidAt: string | null;
  };
  Shop: {
    name: string;
    slug: string;
  };
  userId: number;
  items: {
    id: number;
    productName: string;
    skuPrice: number;
    image: string;
    skuAttributes?: Record<string, string>;
    quantity?: number;
  }[];
  deliveryId?: number;
  addressShipId?: number;
  addressShip?: any;
  voucherId?: number | null;
};

import { useTranslation } from 'react-i18next';

export default function OrderListPage() {
  const { t } = useTranslation();
  
  const TAB_OPTIONS = useMemo(() => [
    { value: 'ALL', label: t('order.tabs.all') },
    { value: 'PENDING_CONFIRMATION', label: t('order.tabs.pending') },
    { value: 'PROCESSING', label: t('order.tabs.shipping') }, // Note: check matching keys
    { value: 'PENDING_PAYMENT', label: t('order.tabs.pending') }, // Assuming some overlap
    { value: 'PENDING_PICKUP', label: t('order.tabs.receive') },
    { value: 'PENDING_DELIVERY', label: t('order.tabs.receive') },
    { value: 'DELIVERED', label: t('order.tabs.completed') },
    { value: 'RETURNED', label: t('order.tabs.returns') },
    { value: 'CANCELLED', label: t('order.tabs.cancelled') },
  ], [t]);

  const PAYMENT_METHODS = useMemo(() => [
    { value: 'ALL', label: t('sellercenter.orders.paymentMethods.all') },
    { value: 'COD', label: t('sellercenter.orders.paymentMethods.cod') },
    { value: 'BANK_TRANSFER', label: t('sellercenter.orders.paymentMethods.bankTransfer') },
    { value: 'CREDIT_CARD', label: t('sellercenter.orders.paymentMethods.creditCard') },
  ], [t]);

  const [selectedTab, setSelectedTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [, setTick] = useState(0);
  const router = useRouter();

  const pageSize = 10;

  const filteredOrders = useMemo(() => {
    let filtered = [...(ordersData.length ? ordersData : [])];

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

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };


  const fetchDataOrder = async () => {
    const res = await getOrdersByShop();
    if (res.status === 'error') {
      toastify.error('error', res.message);
    }
    setOrdersData(res.data.data);
  };

  const fetchAddresswhipDefault = async (id: number) => {
    const res = await addressShipService.getAddressShipDefault(id);
    if (res.status === 'success') {
      if (selectedOrder) {
        selectedOrder.addressShip = res.data;
        setTick((tick) => tick + 1); // Force re-render
      }
    } else {
      toastify.error('error', res.message);
    }
  };

  useEffect(() => {
    fetchDataOrder();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      fetchAddresswhipDefault(selectedOrder.addressShipId as number);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrder]);


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Icon
          icon={iconsStatusOrder.clipboardList}
          className="text-3xl text-gray-700"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t('sellercenter.orders.title')}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon={iconsStatusOrder.search}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <Input
            placeholder={t('sellercenter.orders.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={paymentMethodFilter}
          onValueChange={(value) => {
            setPaymentMethodFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder={t('sellercenter.orders.filterPayment')} />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full flex-wrap h-auto justify-start gap-2 bg-white py-2 ">
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

        <TabsContent value={selectedTab} className="mt-6">
          <div className="hidden md:block rounded-lg border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
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
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      {t('sellercenter.orders.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell className="text-sm">
                        {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.Shop.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              // tabIndex={0}
                              className="outline-none border-none bg-transparent hover:bg-transparent shadow-none cursor-pointer pl-0"
                              variant={'outline'}
                            >
                              {t('sellercenter.orders.table.itemsCount', {
                                count: order.items.length,
                              })}
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent side="top" align="center">
                            {order.items.map((item) => (
                              <div key={item.id}>
                                {item.productName} x {item.quantity || 1}
                              </div>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      <TableCell className="font-medium">
                        {formatCurrency(order.Payment.amount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusToColor(order.status)}
                        >
                          {statusToLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            router.push(
                              `/sellercenter/orders/detail/${order.id}`,
                            );
                          }}
                          variant="ghost"
                          size="sm"
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

          <div className="md:hidden space-y-4">
            {paginatedOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Icon
                    icon={iconsStatusOrder.package}
                    className="text-5xl text-gray-300 mb-3"
                  />
                  <p className="text-gray-500">{t('sellercenter.orders.empty')}</p>
                </CardContent>
              </Card>
            ) : (
              paginatedOrders.map((order) => (
                <Card key={order.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {t('sellercenter.orders.table.orderLabel')} #{order.id}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusToColor(order.status)}
                      >
                        {statusToLabel(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon
                        icon={iconsStatusOrder.package}
                        className="text-gray-400"
                      />
                      <span className="text-gray-600">{order.Shop.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('sellercenter.orders.table.itemsCount', {
                        count: order.items.length,
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon
                        icon={iconsStatusOrder.payment}
                        className="text-gray-400"
                      />
                      <span className="text-gray-600">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {t('sellercenter.orders.table.total')}:
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(order.Payment.amount)}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewDetails(order)}
                      className="w-full"
                      variant="outline"
                    >
                      <Icon icon={iconsStatusOrder.eye} className="mr-2" />
                      {t('sellercenter.orders.viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t('sellercenter.orders.pagination.showing', {
              start: Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length),
              end: Math.min(currentPage * pageSize, filteredOrders.length),
              total: filteredOrders.length
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Icon icon={iconsStatusOrder.chevronLeft} className="mr-1" />
              {t('sellercenter.orders.pagination.prev')}
            </Button>
            <span className="text-sm font-medium">
              {t('sellercenter.orders.pagination.page', {
                current: currentPage,
                total: totalPages
              })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              {t('sellercenter.orders.pagination.next')}
              <Icon icon={iconsStatusOrder.chevronRight} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
