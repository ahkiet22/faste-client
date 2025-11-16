'use client';

import { useState, useMemo } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';

type OrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'PROCESSING'
  | 'PENDING_PAYMENT'
  | 'PENDING_PICKUP'
  | 'PENDING_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

type Order = {
  id: number;
  createdAt: string;
  updatedAt?: string;
  status: OrderStatus;
  paymentMethod: string;
  payment: {
    id: number;
    transactionId?: number;
    amount: number;
    status: string;
    paidAt: string | null;
  };
  shop: {
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
  voucherId?: number | null;
};

const MOCK_ORDERS: Order[] = [
  {
    id: 4,
    createdAt: '2025-01-15T07:50:57.238Z',
    updatedAt: '2025-01-15T09:21:40.858Z',
    status: 'PENDING_PAYMENT',
    paymentMethod: 'COD',
    payment: {
      id: 4,
      transactionId: 3,
      amount: 150000,
      status: 'PENDING',
      paidAt: null,
    },
    shop: { name: 'FastE Office', slug: 'faste-office' },
    userId: 1,
    items: [
      {
        id: 4,
        productName: 'Áo Thun Nam',
        skuPrice: 150000,
        image:
          'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&w=200',
        skuAttributes: { size: 'M', color: 'Đen' },
        quantity: 1,
      },
    ],
    deliveryId: 1,
    addressShipId: 1,
    voucherId: null,
  },
  {
    id: 5,
    createdAt: '2025-01-14T08:30:22.123Z',
    updatedAt: '2025-01-14T10:15:30.456Z',
    status: 'PENDING_CONFIRMATION',
    paymentMethod: 'BANK_TRANSFER',
    payment: {
      id: 5,
      transactionId: 4,
      amount: 450000,
      status: 'PENDING',
      paidAt: null,
    },
    shop: { name: 'Tech Store VN', slug: 'tech-store-vn' },
    userId: 2,
    items: [
      {
        id: 5,
        productName: 'Tai nghe Bluetooth',
        skuPrice: 250000,
        image:
          'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&w=200',
        skuAttributes: { color: 'Trắng' },
        quantity: 1,
      },
      {
        id: 6,
        productName: 'Chuột không dây',
        skuPrice: 200000,
        image:
          'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&w=200',
        skuAttributes: { color: 'Đen' },
        quantity: 1,
      },
    ],
    deliveryId: 2,
    addressShipId: 2,
    voucherId: null,
  },
  {
    id: 6,
    createdAt: '2025-01-13T14:20:10.789Z',
    updatedAt: '2025-01-14T16:45:22.123Z',
    status: 'PROCESSING',
    paymentMethod: 'COD',
    payment: {
      id: 6,
      transactionId: 5,
      amount: 320000,
      status: 'PENDING',
      paidAt: null,
    },
    shop: { name: 'Fashion Hub', slug: 'fashion-hub' },
    userId: 3,
    items: [
      {
        id: 7,
        productName: 'Quần Jean Nam',
        skuPrice: 320000,
        image:
          'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&w=200',
        skuAttributes: { size: 'L', color: 'Xanh' },
        quantity: 1,
      },
    ],
    deliveryId: 3,
    addressShipId: 3,
    voucherId: 1,
  },
  {
    id: 7,
    createdAt: '2025-01-12T09:15:33.456Z',
    updatedAt: '2025-01-13T11:20:45.789Z',
    status: 'PENDING_PICKUP',
    paymentMethod: 'CREDIT_CARD',
    payment: {
      id: 7,
      transactionId: 6,
      amount: 580000,
      status: 'PAID',
      paidAt: '2025-01-12T09:20:00.000Z',
    },
    shop: { name: 'Electronics Pro', slug: 'electronics-pro' },
    userId: 4,
    items: [
      {
        id: 8,
        productName: 'Bàn phím cơ',
        skuPrice: 580000,
        image:
          'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&w=200',
        skuAttributes: { switch: 'Blue', layout: 'TKL' },
        quantity: 1,
      },
    ],
    deliveryId: 4,
    addressShipId: 4,
    voucherId: null,
  },
  {
    id: 8,
    createdAt: '2025-01-11T16:40:55.111Z',
    updatedAt: '2025-01-12T08:30:22.333Z',
    status: 'PENDING_DELIVERY',
    paymentMethod: 'COD',
    payment: {
      id: 8,
      transactionId: 7,
      amount: 750000,
      status: 'PENDING',
      paidAt: null,
    },
    shop: { name: 'Home & Living', slug: 'home-living' },
    userId: 5,
    items: [
      {
        id: 9,
        productName: 'Đèn bàn LED',
        skuPrice: 350000,
        image:
          'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&w=200',
        skuAttributes: { color: 'Trắng' },
        quantity: 1,
      },
      {
        id: 10,
        productName: 'Gối tựa lưng',
        skuPrice: 200000,
        image:
          'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&w=200',
        skuAttributes: { color: 'Xám' },
        quantity: 2,
      },
    ],
    deliveryId: 5,
    addressShipId: 5,
    voucherId: 2,
  },
  {
    id: 9,
    createdAt: '2025-01-10T11:25:44.222Z',
    updatedAt: '2025-01-11T14:10:33.555Z',
    status: 'DELIVERED',
    paymentMethod: 'BANK_TRANSFER',
    payment: {
      id: 9,
      transactionId: 8,
      amount: 920000,
      status: 'PAID',
      paidAt: '2025-01-10T11:30:00.000Z',
    },
    shop: { name: 'Sports World', slug: 'sports-world' },
    userId: 6,
    items: [
      {
        id: 11,
        productName: 'Giày chạy bộ Nike',
        skuPrice: 920000,
        image:
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=200',
        skuAttributes: { size: '42', color: 'Đỏ' },
        quantity: 1,
      },
    ],
    deliveryId: 6,
    addressShipId: 6,
    voucherId: null,
  },
  {
    id: 10,
    createdAt: '2025-01-09T13:50:11.666Z',
    updatedAt: '2025-01-09T15:20:44.888Z',
    status: 'CANCELLED',
    paymentMethod: 'COD',
    payment: {
      id: 10,
      transactionId: 9,
      amount: 180000,
      status: 'CANCELLED',
      paidAt: null,
    },
    shop: { name: 'Book Store', slug: 'book-store' },
    userId: 7,
    items: [
      {
        id: 12,
        productName: 'Sách lập trình Python',
        skuPrice: 180000,
        image:
          'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&w=200',
        skuAttributes: {},
        quantity: 1,
      },
    ],
    deliveryId: 7,
    addressShipId: 7,
    voucherId: null,
  },
  {
    id: 11,
    createdAt: '2025-01-08T10:30:22.999Z',
    updatedAt: '2025-01-10T09:15:55.111Z',
    status: 'RETURNED',
    paymentMethod: 'CREDIT_CARD',
    payment: {
      id: 11,
      transactionId: 10,
      amount: 650000,
      status: 'REFUNDED',
      paidAt: '2025-01-08T10:35:00.000Z',
    },
    shop: { name: 'Fashion Hub', slug: 'fashion-hub' },
    userId: 8,
    items: [
      {
        id: 13,
        productName: 'Áo khoác nữ',
        skuPrice: 650000,
        image:
          'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&w=200',
        skuAttributes: { size: 'M', color: 'Be' },
        quantity: 1,
      },
    ],
    deliveryId: 8,
    addressShipId: 8,
    voucherId: 3,
  },
  {
    id: 12,
    createdAt: '2025-01-16T15:22:10.444Z',
    updatedAt: '2025-01-16T15:22:10.444Z',
    status: 'PENDING_CONFIRMATION',
    paymentMethod: 'COD',
    payment: {
      id: 12,
      transactionId: 11,
      amount: 290000,
      status: 'PENDING',
      paidAt: null,
    },
    shop: { name: 'Tech Store VN', slug: 'tech-store-vn' },
    userId: 9,
    items: [
      {
        id: 14,
        productName: 'Ốp lưng iPhone 14',
        skuPrice: 120000,
        image:
          'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&w=200',
        skuAttributes: { color: 'Đen' },
        quantity: 1,
      },
      {
        id: 15,
        productName: 'Cáp sạc Type-C',
        skuPrice: 85000,
        image:
          'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&w=200',
        skuAttributes: { length: '1m' },
        quantity: 2,
      },
    ],
    deliveryId: 9,
    addressShipId: 9,
    voucherId: null,
  },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  PENDING_PAYMENT: 'Chờ thanh toán',
  PENDING_PICKUP: 'Chờ lấy hàng',
  PENDING_DELIVERY: 'Đang giao hàng',
  DELIVERED: 'Đã giao',
  RETURNED: 'Đã trả hàng',
  CANCELLED: 'Đã hủy',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'bg-amber-100 text-amber-800 border-amber-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800 border-amber-200',
  PENDING_PICKUP: 'bg-orange-100 text-orange-800 border-orange-200',
  PENDING_DELIVERY: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  RETURNED: 'bg-gray-100 text-gray-800 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

const TAB_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'PENDING_PICKUP', label: 'Chờ lấy hàng' },
  { value: 'PENDING_DELIVERY', label: 'Đang giao hàng' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'RETURNED', label: 'Đã trả hàng' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const PAYMENT_METHODS = [
  { value: 'ALL', label: 'Tất cả phương thức' },
  { value: 'COD', label: 'COD' },
  { value: 'BANK_TRANSFER', label: 'Chuyển khoản' },
  { value: 'CREDIT_CARD', label: 'Thẻ tín dụng' },
];

function statusToLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] || status;
}

function statusToColor(status: OrderStatus): string {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

const icons = {
  search: 'mdi:magnify',
  eye: 'mdi:eye-outline',
  clipboardList: 'mdi:clipboard-list-outline',
  chevronLeft: 'mdi:chevron-left',
  chevronRight: 'mdi:chevron-right',
  package: 'mdi:package-variant-closed',
  payment: 'mdi:credit-card-outline',
  localShipping: 'mdi:truck-outline',
};

export default function OrderListPage() {
  const [selectedTab, setSelectedTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const pageSize = 10;

  const filteredOrders = useMemo(() => {
    let filtered = [...MOCK_ORDERS];

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
          order.shop.name.toLowerCase().includes(query) ||
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
  }, [selectedTab, searchQuery, paymentMethodFilter]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleActionClick = (action: string) => {
    alert(`Thực hiện hành động: ${action} cho đơn hàng #${selectedOrder?.id}`);
  };

  const getActionButtons = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return (
          <>
            <Button
              onClick={() => handleActionClick('Xác nhận đơn hàng')}
              size="sm"
            >
              Xác nhận đơn hàng
            </Button>
            <Button
              onClick={() => handleActionClick('Hủy đơn')}
              variant="outline"
              size="sm"
            >
              Hủy đơn
            </Button>
          </>
        );
      case 'PENDING_PAYMENT':
        return (
          <Button
            onClick={() => handleActionClick('Gửi nhắc thanh toán')}
            size="sm"
          >
            Gửi nhắc thanh toán
          </Button>
        );
      case 'PROCESSING':
        return (
          <Button
            onClick={() => handleActionClick('Chuẩn bị giao hàng')}
            size="sm"
          >
            Chuẩn bị giao hàng
          </Button>
        );
      case 'PENDING_PICKUP':
        return (
          <Button
            onClick={() => handleActionClick('Xác nhận đã lấy hàng')}
            size="sm"
          >
            Xác nhận đã lấy hàng
          </Button>
        );
      case 'PENDING_DELIVERY':
        return (
          <Button
            onClick={() => handleActionClick('Xem vận đơn')}
            variant="outline"
            size="sm"
          >
            Xem vận đơn
          </Button>
        );
      case 'DELIVERED':
        return (
          <Button
            onClick={() => handleActionClick('In hóa đơn')}
            variant="outline"
            size="sm"
          >
            In hóa đơn
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Icon icon={icons.clipboardList} className="text-3xl text-gray-700" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Quản lý đơn hàng
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon icon={icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>
          <Input
            placeholder="Tìm theo mã đơn hàng, tên sản phẩm, shop..."
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
            <SelectValue placeholder="Lọc theo thanh toán" />
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
        <TabsList className="w-full flex-wrap h-auto justify-start gap-2 bg-transparent p-0">
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
                  <TableHead className="w-[100px]">Mã đơn</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      Không tìm thấy đơn hàng nào
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
                        {order.shop.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.items.length} sản phẩm
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.payment.amount)}
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
                          onClick={() => handleViewDetails(order)}
                          variant="ghost"
                          size="sm"
                        >
                          <Icon icon={icons.eye} className="mr-1" />
                          
                          Xem
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
                  <Icon icon={icons.package} className="text-5xl text-gray-300 mb-3" />
                  <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
                </CardContent>
              </Card>
            ) : (
              paginatedOrders.map((order) => (
                <Card key={order.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Đơn hàng #{order.id}
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
                      <Icon icon={icons.package} className="text-gray-400" /> 
                      <span className="text-gray-600">{order.shop.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} sản phẩm
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon={icons.payment} className="text-gray-400" />
                      <span className="text-gray-600">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tổng tiền:</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(order.payment.amount)}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewDetails(order)}
                      className="w-full"
                      variant="outline"
                    >
                      <Icon icon={icons.eye} className="mr-2" />
                      Xem chi tiết
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
            Hiển thị{' '}
            {Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)}{' '}
            - {Math.min(currentPage * pageSize, filteredOrders.length)} trong
            tổng số {filteredOrders.length} đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Icon icon={icons.chevronLeft} className="mr-1" />
              Trước
            </Button>
            <span className="text-sm font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Sau
              <Icon icon={icons.chevronRight} className="ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chi tiết đơn hàng #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge
                        variant="outline"
                        className={statusToColor(selectedOrder.status)}
                      >
                        {statusToLabel(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">
                        {dayjs(selectedOrder.createdAt).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </span>
                    </div>
                    {selectedOrder.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cập nhật:</span>
                        <span className="font-medium">
                          {dayjs(selectedOrder.updatedAt).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className="font-medium">
                        {selectedOrder.payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(selectedOrder.payment.amount)}
                      </span>
                    </div>
                    {selectedOrder.payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đã thanh toán:</span>
                        <span className="font-medium">
                          {dayjs(selectedOrder.payment.paidAt).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Sản phẩm
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Image
                        width={100}
                        height={100}
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.productName}
                        </h4>
                        {item.skuAttributes &&
                          Object.keys(item.skuAttributes).length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {Object.entries(item.skuAttributes)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">
                            x{item.quantity || 1}
                          </span>
                          <span className="font-medium text-primary">
                            {formatCurrency(item.skuPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Địa chỉ giao hàng
                </h3>
                <div className="flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <Icon icon={icons.localShipping} className="text-xl text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Nguyễn Văn A</p>
                    <p className="text-gray-600">0123456789</p>
                    <p className="text-gray-600">
                      123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Đơn hàng được tạo</p>
                      <p className="text-xs text-gray-500">
                        {dayjs(selectedOrder.createdAt).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Cập nhật trạng thái
                        </p>
                        <p className="text-xs text-gray-500">
                          {dayjs(selectedOrder.updatedAt).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedOrder && getActionButtons(selectedOrder.status)}
            <Button onClick={handleCloseModal} variant="outline">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
