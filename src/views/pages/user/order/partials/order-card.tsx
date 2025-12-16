'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/router';
import { OrderStatus } from '@/enums';
import { memo } from 'react';
import dayjs from 'dayjs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  console.log('REDNER');

  const getOrderStatusMeta = (status: OrderStatus) => {
    return (
      ORDER_STATUS_META[status] ?? {
        label: 'Không xác định',
        color: 'text-gray-600',
      }
    );
  };

  const ORDER_STATUS_META: Record<
    OrderStatus,
    { label: string; color: string }
  > = {
    [OrderStatus.PENDING_CONFIRMATION]: {
      label: 'Chờ xác nhận',
      color: 'text-gray-600',
    },
    [OrderStatus.PROCESSING]: {
      label: 'Đang xử lý',
      color: 'text-sky-600',
    },
    [OrderStatus.PENDING_PAYMENT]: {
      label: 'Chờ thanh toán',
      color: 'text-yellow-600',
    },
    [OrderStatus.PENDING_PICKUP]: {
      label: 'Chờ lấy hàng',
      color: 'text-blue-600',
    },
    [OrderStatus.PENDING_DELIVERY]: {
      label: 'Đang giao hàng',
      color: 'text-indigo-600',
    },
    [OrderStatus.DELIVERED]: {
      label: 'Đã giao thành công',
      color: 'text-green-600',
    },
    [OrderStatus.RECEIVED]: {
      label: 'Đã giao thành công',
      color: 'text-green-600',
    },
    [OrderStatus.RETURNED]: {
      label: 'Đã trả hàng / hoàn hàng',
      color: 'text-rose-600',
    },
    [OrderStatus.CANCELLED]: {
      label: 'Đã hủy đơn',
      color: 'text-orange-600',
    },
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="overflow-hidden border rounded-xl transition-shadow bg-card">
      {/* Shop Header */}
      {order.orders.map((od: any) => {
        let attributeKeys: string[] = [];
        if (od.items[0].skuAttributes) {
          attributeKeys = Object.keys(od.items[0].skuAttributes);
        }
        return (
          <div key={order.transactionId + od.id}>
            <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {od.Shop.name}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-gray-400 flex items-center gap-1 cursor-pointer">
                  <Icon icon={'entypo:chat'} />
                  <span>Chat ngay</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    handleNavigate(`${ROUTE_CONFIG.SHOP}/${od.Shop.slug}`)
                  }
                >
                  <Icon icon={'bx:store'} />
                  <span>Xem Shop</span>
                </Button>
              </div>
              <div
                className={`text-right text-xs sm:text-sm font-semibold ${getOrderStatusMeta(od.status).color}`}
              >
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
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                    {od.items[0].productName}
                  </h3>
                  {attributeKeys.map((key, idx) => (
                    <p
                      key={key + idx + od.id}
                      className="text-xs text-gray-600 mt-1"
                    >
                      {key}: {od.items[0].skuAttributes[key]}
                    </p>
                  ))}
                  <p className="text-xs text-gray-600">
                    X{od.items[0].quantity}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(od.items[0].skuPrice * od.items[0].quantity)}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-orange-600">
                      {formatPrice(od.Payment.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-gray-200 w-full"></div>
          </div>
        );
      })}

      {/* Footer with Total and Actions */}
      <div className="bg-card px-4 sm:px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-gray-500">
            {order.orders[0].status === OrderStatus.RECEIVED && (
              <>
                <span>Đánh giá sản phẩm trước</span>{' '}
                <Tooltip>
                  <TooltipTrigger className="text-xs text-gray-500 underline cursor-pointer">
                    {order.orders[0].status === OrderStatus.RECEIVED &&
                      `${dayjs(order.orders[0].updatedAt).add(30, 'day').format('DD-MM-YYYY')}`}
                  </TooltipTrigger>
                 <TooltipContent side='bottom' className='bg-neutral-200 [&_svg]:bg-neutral-200 [&_svg]:fill-neutral-200 text-neutral-950'>
                    <p className="max-w-[200px]">{`Bạn sẽ không thể đánh giá đơn hàng và nhận 200 Shopee Xu sau ngày ${dayjs(order.orders[0].updatedAt).add(30, 'day').format('DD-MM-YYYY')}. Hãy đánh giá sản phẩm và nhận 200 Shopee Xu ngay!`}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
          <div className="space-y-4">
            <div className="text-right flex justify-end items-center gap-x-2">
              <p className="text-xs text-gray-600">Thành tiền:</p>
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
                        Thanh toán ngay
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        Liên Hệ Người Bán
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        Hủy Đơn Hàng
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
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        Liên Hệ Người Bán
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        Hủy Đơn Hàng
                      </Button>
                    </>
                  )}

                {/* ===== CHỜ XÁC NHẬN ĐƠN HÀNG ===== */}
                {order.orders[0].status === OrderStatus.PENDING_CONFIRMATION ||
                  (order.orders[0].status === OrderStatus.PROCESSING && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        Liên Hệ Người Bán
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                      >
                        Hủy Đơn Hàng
                      </Button>
                    </>
                  ))}

                {/* ===== ĐANG GIAO ===== */}
                {order.orders[0].status === OrderStatus.PENDING_DELIVERY && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                    >
                      Theo Dõi Đơn Hàng
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto cursor-pointer"
                    >
                      Liên Hệ Người Bán
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
                      Đã Nhận Hàng
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      Liên Hệ Người Bán
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      Yêu Cầu Trả Hàng/Hoàn Tiền
                    </Button>
                  </>
                )}

                {/* ===== XÁC NHẬN ĐÃ NHẬN ===== */}
                {order.orders[0].status === OrderStatus.RECEIVED && (
                  <>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto cursor-pointer"
                      onClick={() =>
                        handleProductRating(order?.orders[0]?.items[0].orderId)
                      }
                    >
                      Đánh giá
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      Liên Hệ Người Bán
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      Mua Lại
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
                      Mua Lại
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      Xem chi tiết đơn hủy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm font-normal bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 h-auto"
                    >
                      Liên Hệ Người Bán
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
                    Mua Lại
                  </Button>
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
