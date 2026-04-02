'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/router';
import { OrderStatus } from '@/enums';
import { memo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AlertConfirm from '@/components/AlertConfirm';
import { cancelOrder } from '@/services/order';
import { toastify } from '@/components/ToastNotification';
import { useTranslation } from 'react-i18next';


interface OrderCardProps {
  // order: {
  //   id: number;
  //   shopName: string;
  //   shopId: string;
  //   productImage: string;
  //   productName: string;
  //   variant: string;
  //   quantity: number;
  //   originalPrice: number;
  //   discountedPrice: number;
  //   totalPrice: number;
  //   status: string;
  //   statusLabel: string;
  //   statusNote?: string;
  //   isFavorite: boolean;
  // };
  order: any;
  handleProductRating: (id: number) => void;
  handleConfirnReceived: (id: number) => void;
}

const OrderCard = memo(function OrderCard({
  order,
  handleProductRating,
  handleConfirnReceived,
}: OrderCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [openCancel, setOpenCancel] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getOrderStatusMeta = (status: OrderStatus) => {
    return (
      ORDER_STATUS_META[status] ?? {
        label: t('order.status.unknown'),
        color: 'text-gray-600',
      }
    );
  };

  const ORDER_STATUS_META: Record<
    OrderStatus,
    { label: string; color: string }
  > = {
    [OrderStatus.PENDING_CONFIRMATION]: {
      label: t('order.status.pendingConfirmation'),
      color: 'text-gray-600',
    },
    [OrderStatus.PROCESSING]: {
      label: t('order.status.processing'),
      color: 'text-sky-600',
    },
    [OrderStatus.PENDING_PAYMENT]: {
      label: t('order.status.pendingPayment'),
      color: 'text-yellow-600',
    },
    [OrderStatus.PENDING_PICKUP]: {
      label: t('order.status.pendingPickup'),
      color: 'text-blue-600',
    },
    [OrderStatus.PENDING_DELIVERY]: {
      label: t('order.status.pendingDelivery'),
      color: 'text-indigo-600',
    },
    [OrderStatus.DELIVERED]: {
      label: t('order.status.delivered'),
      color: 'text-green-600',
    },
    [OrderStatus.RECEIVED]: {
      label: t('order.status.delivered'),
      color: 'text-green-600',
    },
    [OrderStatus.RETURNED]: {
      label: t('order.status.returned'),
      color: 'text-rose-600',
    },
    [OrderStatus.CANCELLED]: {
      label: t('order.status.cancelled'),
      color: 'text-orange-600',
    },
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const openCancelConfirm = (id: string) => {
    setCancelOrderId(id);
    setOpenCancel(true);
  };
  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;
    try {
      await cancelOrder(Number(cancelOrderId));
      toastify.success(t('order.status.updateSuccess'), t('order.status.updateSuccessDesc')); // I should probably simplify toastify calls or add keys
    } catch (error) {
      toastify.error(t('order.status.updateError'), t('order.status.updateErrorDesc'));
    }
    setOpenCancel(false);
    setCancelOrderId(null);
  };

  return (
    <div className="overflow-hidden border rounded-xl transition-shadow bg-card">
      <AlertConfirm
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onConfirm={handleCancelOrder}
        title={t('order.cancelConfirmTitle')}
        description={t('order.cancelConfirmDescription')}
      />
      {/* Shop Header */}
      {order.orders.map((od: any) => {
        let attributeKeys: string[] = [];
        if (od.items[0].skuAttributes) {
          attributeKeys = Object.keys(od.items[0].skuAttributes);
        }
        return (
          <div key={order.transactionId + od.id}>
            <div className="px-4 sm:px-6 py-3 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="font-semibold text-foreground text-sm sm:text-base">
                  {od.Shop.name}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-gray-400 flex items-center gap-1 cursor-pointer">
                  <Icon icon={'entypo:chat'} />
                  <span>{t('order.chatNow')}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs border border-border text-foreground hover:bg-muted cursor-pointer"
                  onClick={() =>
                    handleNavigate(`${ROUTE_CONFIG.SHOP}/${od.Shop.slug}`)
                  }
                >
                  <Icon icon={'bx:store'} />
                  <span>{t('order.viewShop')}</span>
                </Button>
              </div>
              <div className={`text-left sm:text-right text-xs sm:text-sm font-semibold whitespace-nowrap ${getOrderStatusMeta(od.status).color}`}>
                {getOrderStatusMeta(od.status).label}
              </div>
            </div>

            {/* Product Section */}
            <div className="px-4 sm:px-6 py-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src={od.items[0].image || '/placeholder.svg'}
                    alt={od.items[0].productName}
                    className="w-20 h-20 object-cover rounded-lg bg-muted"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-medium text-foreground line-clamp-2 text-sm">
                    {od.items[0].productName}
                  </h3>
                  {attributeKeys.map((key, idx) => (
                    <p
                      key={key + idx + od.id}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      {key}: {od.items[0].skuAttributes[key]}
                    </p>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    X{od.items[0].quantity}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(od.items[0].skuPrice * od.items[0].quantity)}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-orange-600">
                      {formatPrice(od.Payment.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-border w-full"></div>
          </div>
        );
      })}

      {/* Footer with Total and Actions */}
      <div className="bg-card px-4 sm:px-6 py-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-gray-500">
            {order.orders[0].status === OrderStatus.RECEIVED &&
              !order.orders[0].isReviewed && (
                <>
                  <span>{t('order.reviewBefore')}</span>{' '}
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-gray-500 underline cursor-pointer">
                      {order.orders[0].status === OrderStatus.RECEIVED &&
                        `${dayjs(order.orders[0].updatedAt).add(30, 'day').format('DD-MM-YYYY')}`}
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-neutral-200 [&_svg]:bg-neutral-200 [&_svg]:fill-neutral-200 text-neutral-950"
                    >
                      <p className="max-w-[200px]">
                        {t('order.reviewPenaltyNote', {
                          date: dayjs(order.orders[0].updatedAt)
                            .add(30, 'day')
                            .format('DD-MM-YYYY'),
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
          </div>
          <div className="space-y-4">
            <div className="text-right flex justify-end items-center gap-x-2">
              <p className="text-xs text-muted-foreground">{t('order.totalAmountLabel')}</p>
              <p className="text-lg sm:text-xl font-bold text-orange-600">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap justify-end">
                {/* ===== CHỜ THANH TOÁN (Không phải COD) ===== */}
                {order.paymentStatus === 'PENDING' &&
                  order.orders[0].paymentMethod !== 'COD' &&
                  order.orders[0].status === OrderStatus.PENDING_PAYMENT && (
                    <>
                      <Button
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto cursor-pointer"
                        onClick={() =>
                          handleNavigate(
                            `${ROUTE_CONFIG.PAYMENT}/${order.transactionId}`,
                          )
                        }
                      >
                        {t('order.payNow')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        {t('order.contactSeller')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                        onClick={() => openCancelConfirm(order.orders[0].id)}
                      >
                        {t('order.cancelOrder')}
                      </Button>
                    </>
                  )}

                {/* ===== CHỜ THANH TOÁN (COD) ===== */}
                {order.paymentStatus === 'PENDING' &&
                  order.orders[0].paymentMethod === 'COD' &&
                  order.orders[0].status === OrderStatus.PENDING_PAYMENT && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-background text-foreground border-border hover:bg-muted px-3 py-2 h-auto cursor-pointer"
                      >
                        Liên Hệ Người Bán
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-background text-foreground border-border hover:bg-muted px-3 py-2 h-auto cursor-pointer"
                        onClick={() => openCancelConfirm(order.orders[0].id)}
                      >
                        Hủy Đơn Hàng
                      </Button>
                    </>
                  )}

                {/* ===== CHỜ XÁC NHẬN ĐƠN HÀNG ===== */}
                {(order.orders[0].status === OrderStatus.PENDING_CONFIRMATION ||
                  order.orders[0].status === OrderStatus.PROCESSING) && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                    >
                      {t('order.contactSeller')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      onClick={() => openCancelConfirm(order.orders[0].id)}
                    >
                      {t('order.cancelOrder')}
                    </Button>
                  </>
                )}

                {/* ===== ĐANG GIAO ===== */}
                {order.orders[0].status === OrderStatus.PENDING_DELIVERY && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                    >
                      {t('order.trackOrder')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                    >
                      {t('order.contactSeller')}
                    </Button>
                  </>
                )}

                {/* ===== ĐÃ GIAO ===== */}
                {order.orders[0].status === OrderStatus.DELIVERED && (
                  <>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto cursor-pointer"
                      onClick={() =>
                        handleConfirnReceived(
                          order?.orders[0]?.items[0].orderId,
                        )
                      }
                    >
                      {t('order.received')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      {t('order.contactSeller')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      {t('order.returnRequest')}
                    </Button>
                  </>
                )}

                {/* ===== XÁC NHẬN ĐÃ NHẬN ===== */}
                {order.orders[0].status === OrderStatus.RECEIVED &&
                  !order.orders[0].isReviewed && (
                    <>
                      <Button
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto cursor-pointer"
                        onClick={() =>
                          handleProductRating(
                            order?.orders[0]?.items[0].orderId,
                          )
                        }
                      >
                        {t('order.rate')}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                      >
                        {t('order.contactSeller')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                      >
                        {t('order.buyAgain')}
                      </Button>
                    </>
                  )}

                {/* ===== HỦY ĐƠN ===== */}
                {order.orders[0].status === OrderStatus.CANCELLED && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto cursor-pointer"
                    >
                      {t('order.buyAgain')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      {t('order.viewCancelledDetails')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      {t('order.contactSeller')}
                    </Button>
                  </>
                )}

                {/* ===== TRẢ HÀNG ===== */}
                {order.orders[0].status === OrderStatus.RETURNED && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                  >
                    {t('order.buyAgain')}
                  </Button>
                )}

                {/* ==== Đã đánh giá ==== */}
                {order.orders[0].status === OrderStatus.RECEIVED &&
                  order.orders[0].isReviewed && (
                    <>
                      <Button
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto cursor-pointer"
                        onClick={() => {}}
                      >
                        {t('order.buyAgain')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                      >
                        {t('order.contactSeller')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-background text-foreground border-border hover:bg-muted px-3 py-2 h-auto"
                      >
                        {t('order.viewReview')}
                      </Button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrderCard;
