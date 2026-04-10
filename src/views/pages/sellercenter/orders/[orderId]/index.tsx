'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { toastify } from '@/components/ToastNotification';
import {
  cancelOrder,
  getDetailOrderByIdByShop,
  updateOrderStatus,
} from '@/services/order.service';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import {
  Package,
  Clock,
  XCircle,
  Truck,
  CheckCircle2,
  Calendar,
  Loader2,
  Hash,
} from 'lucide-react';
import dayjs from 'dayjs';
import { Separator } from '@/components/ui/separator';
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  statusToColor,
  statusToLabel,
} from '@/configs/order';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/helpers/currency';
import { addressShipService } from '@/services/address-ship.service';
import { OrderStatus } from '@/types/order';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
interface Props {
  orderId: string;
}

export const OrderDetailPage = ({ orderId }: Props) => {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>('');
  const [, setTick] = useState(0);
  const router = useRouter();

  // Fetch Data
  const fetchDataOrder = async (orderId: string) => {
    setLoading(true);
    const order = await getDetailOrderByIdByShop(Number(orderId));
    if (order.status === 'error') {
      toastify.error(order.message || 'Lấy chi tiết đơn hàng thất bại.');
      return notFound();
    }
    setOrderData(order.data);
    setLoading(false);
  };
  const fetchAddresswhipDefault = async (id: number) => {
    const res = await addressShipService.getAddressShipDefault(id);
    if (res.status === 'success') {
      if (orderData) {
        orderData.addressShip = res.data;
        setTick((tick) => tick + 1);
      }
    } else {
      toastify.error('error', res.message);
    }
  };

  // ** useEffect
  useEffect(() => {
    if (orderData) {
      fetchAddresswhipDefault(orderData.addressShipId as number);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData]);
  useEffect(() => {
    fetchDataOrder(orderId);
  }, [orderId]);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== orderData.status) {
      setPendingStatus(newStatus);
      setOpenStatusDialog(true);
    }
  };

  const confirmStatusChange = async () => {
    setUpdatingStatus(true);
    const res = await updateOrderStatus(Number(orderId), {
      status: pendingStatus as OrderStatus,
    });
    if (res.status === 'success') {
      setOrderData({ ...orderData, status: pendingStatus });
      toastify.success('Cập nhật trạng thái thành công!');
      setOpenStatusDialog(false);
    } else {
      toastify.error('Cập nhật trạng thái thất bại!');
    }
    setUpdatingStatus(false);
  };

  const handleCancelOrder = async () => {
    setUpdatingStatus(true);
    const res = await cancelOrder(Number(orderId));
    if (res.status === 'success') {
      toastify.success('Đơn hàng đã được hủy');
      setOpenCancelDialog(false);
    } else {
      toastify.error('Hủy đơn thất bại');
    }
    setUpdatingStatus(false);
  };

  if (loading) return <LoadingUI />;
  if (!orderData) return null;

  const { Payment, items, status, createdAt, Shop, paymentMethod } = orderData;

  const getStatusConfig = (status: string) => {
    const configs: any = {
      PENDING_PAYMENT: {
        label: 'Chờ thanh toán',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
      },
      PROCESSING: {
        label: 'Đang xử lý',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Package,
      },
      SHIPPING: {
        label: 'Đang vận chuyển',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Truck,
      },
      COMPLETED: {
        label: 'Hoàn thành',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle2,
      },
      CANCELLED: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
      },
    };
    return configs[status] || configs.PENDING_PAYMENT;
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const handleClose = () => {
    router.back(); // Quay lại list
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng #{orderId}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingDialog isLoading />
        ) : (
          <div className="min-h-screen bg-white py-8 px-4">
            <div className="mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Hash size={28} className="text-slate-400" />
                    Đơn hàng {orderId}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>
                        Tạo lúc: {new Date(createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>
                        Cập nhật:{' '}
                        {new Date(orderData.updatedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Select
                    onValueChange={handleStatusChange}
                    value={status}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-64 h-11 border-2 hover:border-blue-400 transition-colors">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon icon={option.icon} />
                            {STATUS_LABELS[option.value]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    className="gap-2 h-11 shadow-md transition-all"
                    onClick={() => setOpenCancelDialog(true)}
                    disabled={status === 'CANCELLED' || status === 'COMPLETED'}
                  >
                    <XCircle size={18} />
                    Hủy đơn hàng
                  </Button>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
                  {/* Cột 1 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Thông tin đơn hàng
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <Badge
                          variant="outline"
                          className={statusToColor(orderData.status)}
                        >
                          {statusToLabel(orderData.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="font-medium">
                          {dayjs(orderData.createdAt).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                        </span>
                      </div>
                      {orderData.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cập nhật:</span>
                          <span className="font-medium">
                            {dayjs(orderData.updatedAt).format(
                              'DD/MM/YYYY HH:mm',
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-0.5 bg-red-300 mx-auto hidden md:block" />

                  {/* Cột 2 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Thông tin thanh toán
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phương thức:</span>
                        <span className="font-medium">
                          {orderData.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className="font-medium">
                          {orderData.Payment.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(orderData.Payment.amount)}
                        </span>
                      </div>
                      {orderData.Payment.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đã thanh toán:</span>
                          <span className="font-medium">
                            {dayjs(orderData.Payment.paidAt).format(
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
                    {orderData.items.map((item: any) => (
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
                    <Icon
                      icon={'mdi:truck-outline'}
                      className="text-xl text-gray-400 mt-0.5"
                    />
                    <div>
                      <p className="font-medium">
                        {orderData.addressShip?.name || 'or'}
                      </p>
                      <p className="text-gray-600">
                        {orderData.addressShip?.phone || '0123456789'}
                      </p>
                      <p className="text-gray-600">
                        {orderData.addressShip?.address},{' '}
                        {orderData.addressShip?.divisionPath['WARD']},{' '}
                        {orderData.addressShip?.divisionPath['DISTRICT']},{' '}
                        {orderData.addressShip?.divisionPath['PROVINCE']}
                        123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-x-2 overflow-hidden">
                  {Array.from({ length: 50 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-[3px] flex-1 ${index % 2 === 0 ? 'bg-blue-300' : 'bg-red-300'}`}
                    />
                  ))}
                </div>

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
                          {dayjs(orderData.createdAt).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                        </p>
                      </div>
                    </div>
                    {orderData.updatedAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Cập nhật trạng thái
                          </p>
                          <p className="text-xs text-gray-500">
                            {dayjs(orderData.updatedAt).format(
                              'DD/MM/YYYY HH:mm',
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Change Dialog */}
              <AlertDialog
                open={openStatusDialog}
                onOpenChange={setOpenStatusDialog}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Package className="text-blue-600" />
                      Xác nhận thay đổi trạng thái
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 pt-2">
                      <span>Bạn có chắc muốn thay đổi trạng thái đơn hàng?</span>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">
                          {getStatusConfig(status).label}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-blue-600">
                          {getStatusConfig(pendingStatus).label}
                        </span>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={updatingStatus}>
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmStatusChange}
                      disabled={updatingStatus}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {updatingStatus ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Xác nhận'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Cancel Dialog */}
              <AlertDialog
                open={openCancelDialog}
                onOpenChange={setOpenCancelDialog}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <XCircle />
                      Xác nhận hủy đơn hàng
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này
                      không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={updatingStatus}>
                      Thoát
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelOrder}
                      disabled={updatingStatus}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {updatingStatus ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Xác nhận hủy'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const LoadingUI = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div className="max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-12 w-80" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  </div>
);

export default OrderDetailPage;
