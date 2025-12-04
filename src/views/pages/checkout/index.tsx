'use client';

import { Controller, useForm } from 'react-hook-form';
import { SummaryCard } from '../cart/partials/summary-card';
import PaymentOption from './partials/payment-option';
import { RadioGroup } from '@/components/ui/radio-group';
import DeliveryOption from './partials/delivery-option';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCheckoutItems } from '@/helpers/storage/get';
import { ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/router';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';
import { clearCheckoutItems } from '@/helpers/storage/clear';
import { createOrder } from '@/services/order';
import { CreateOrderType } from '@/types/order';
import dynamic from 'next/dynamic';

const ConfirmModal = dynamic(() => import('./partials/confirm-modal'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
interface CheckoutFormData {
  deliveryId: number;
  paymentMethod: 'COD' | 'SEPAY' | 'WEB3';
}

interface DeliveryMethod {
  id: number;
  name: string;
  estimatedTime: string;
  cost: number;
  provider: string;
}

interface CartItemData {
  id: number;
  image: string;
  name: string;
  quantity: number;
  price: number;
}

const deliveryMethods: DeliveryMethod[] = [
  {
    id: 1,
    name: 'Giao tiết kiếm',
    estimatedTime: '13h - 18h, 28/10',
    cost: 16500,
    provider: 'Được giao bởi Praza',
  },
  {
    id: 2,
    name: 'Giao nhanh',
    estimatedTime: '9h - 12h, 28/10',
    cost: 49000,
    provider: 'Được giao bởi Praza',
  },
];

const paymentMethods = [
  { id: 'COD', label: 'Thanh toán tiền mặt', icon: 'mdi:cash' },
  { id: 'SEPAY', label: 'SEPAY', icon: 'mdi:wallet' },
  { id: 'PAYFAST', label: 'PayFast', icon: 'mdi:mobile-payment' },
  { id: 'WEB3', label: 'Web3 Wallet', icon: 'mdi:ethereum' },
];

export const CheckoutPage = () => {
  const [checkoutItems, setCheckoutItems] = useState<any[]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<CheckoutFormData | null>(null);
  const router = useRouter();
  const { i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { isValid },
  } = useForm<CheckoutFormData>({
    mode: 'onChange',
    defaultValues: {
      deliveryId: deliveryMethods[0].id,
      paymentMethod: 'COD',
    },
  });

  const selectedDeliveryId = watch('deliveryId');

  const getCheckoutItemsLocal = () => {
    try {
      const data = getCheckoutItems();
      setCheckoutItems(data);
    } catch (error) {}
  };
  useEffect(() => {
    getCheckoutItemsLocal();
  }, []);

  const selectedItems = useMemo(() => {
    return (
      checkoutItems?.flatMap((shop) =>
        shop.cartItems.filter((item: any) => item.isSelected),
      ) ?? []
    );
  }, [checkoutItems]);
  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.sku.price * item.quantity,
        0,
      ),
    [selectedItems],
  );
  const shipping: any = deliveryMethods.find(
    (item) => item.id === selectedDeliveryId,
  )?.cost;

  const discount = 0;
  const total = useMemo(
    () => subtotal + shipping - discount,
    [shipping, subtotal],
  );

  const onSubmit = async (data: CheckoutFormData) => {
    setPendingFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmCheckout = async () => {
    if (!pendingFormData) return;

    setIsSubmitting(true);
    setSubmitStatus('loading');

    try {
      let payloads: CreateOrderType = [];

      if (checkoutItems) {
        payloads = checkoutItems.map((shop) => ({
          shopId: shop.shop.shopid,
          addressShipId: 1,
          deliveryId: pendingFormData.deliveryId,
          paymentMethod: pendingFormData.paymentMethod,
          cartItemIds: shop.cartItems.map((item: { id: number }) => item.id),
        }));
      }
      const res = await createOrder(payloads);

      if (res.statusCode !== 201) throw new Error('Checkout failed');
      console.log('payload data', payloads, res);

      setSubmitStatus('success');
      setTimeout(() => {
        // Handle success - redirect to confirmation page
        console.log('Order placed successfully');
        if (pendingFormData.paymentMethod !== 'COD') {
          clearCheckoutItems();
          router.push(`${ROUTE_CONFIG.PAYMENT}`);
        }
      }, 1500);
    } catch (error) {
      console.error('Checkout error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleOpenConfirmModal = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  console.log('==== Checkout Page render', {
    checkoutItems: checkoutItems ? 'has data' : 'undefined',
    timestamp: Date.now(),
  });

  return (
    <main className="min-h-screen">
      {submitStatus === 'loading' && <LoadingDialog isLoading={true} />}
      <div className="max-w-6xl mx-auto p-2">
        {/* Header */}
        <div className="mb-4 flex">
          <h2 className="text-xl font-bold text-foreground mb-2">FastE | </h2>
          <h3 className="text-xl font-bold text-foreground mb-2">Thanh toán</h3>
        </div>

        {/* Main Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Panel - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-t-lg">
              <div className="flex-1 text-sm font-medium text-muted-foreground">
                Sản phẩm
              </div>
              <div className="flex-shrink-1 w-30 text-left text-sm font-medium text-muted-foreground">
                Đơn giá
              </div>
              <div className="flex-shrink-0 text-sm text-left font-medium text-muted-foreground">
                Số lượng
              </div>
              <div className="flex-shrink-0 w-24 text-left text-sm font-medium text-muted-foreground">
                Thành tiền
              </div>
            </div>
            {checkoutItems?.map((shop, index) => (
              <div
                className="space-y-4 w-full bg-card p-4 rounded-md"
                key={shop.shop.shopid + index}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-semibold text-sm text-foreground">
                    {shop.shop.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-gray-400 flex items-center gap-1 cursor-pointer">
                    <Icon icon={'entypo:chat'} />
                    <span>Chat ngay</span>
                  </div>
                </div>
                {shop.cartItems.map((item: any, idx: number) => {
                  let attributeKeys: string[] = [];
                  if (item.sku.attributes) {
                    attributeKeys = Object.keys(item.sku.attributes);
                  }
                  return (
                    <div
                      className="transition-colors flex justify-between items-center"
                      key={item.id + index + idx}
                    >
                      {/* Checkbox */}

                      {/* Product Image + Title + Attributes */}
                      <div className="align-top">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 border border-gray-200">
                            <Image
                              src={item.sku.product.images[0] || '/next.svg'}
                              alt={'ok'}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium text-foreground line-clamp-2">
                              {item.sku.product.name}
                            </h3>

                            {/* Attributes */}
                            <div className="flex flex-wrap gap-2">
                              {attributeKeys.map((key) => (
                                <span
                                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                                  key={`${key} + ${item.id}`}
                                >
                                  {`${key} : ${item.sku.attributes[key]}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="px-4 py-4 align-top text-right">
                        <span className="text-lg font-semibold text-destructive">
                          {formatCurrencyWithExchange(Number(item.sku.price), {
                            language: i18n.language as 'vi' | 'en',
                          })}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="px-4 py-4 align-top text-center">
                        <div className="inline-flex items-center gap-2 border border-border rounded-md">
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="px-4 py-4 align-top text-right font-semibold">
                        {formatCurrencyWithExchange(
                          Number(item.sku.price * item.quantity),
                          {
                            language: i18n.language as 'vi' | 'en',
                          },
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {/* Product  */}

            <div className="space-y-4 w-full bg-card p-2 rounded-md">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Chọn hình thức giao hàng
                </h2>
                <p className="text-sm text-muted-foreground">
                  Chọn phương thức giao hàng phù hợp với bạn
                </p>
              </div>
              <Controller
                name="deliveryId"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <div className="flex items-center gap-x-2">
                      {deliveryMethods.map((method) => (
                        <DeliveryOption
                          key={method.id}
                          method={method}
                          isSelected={selectedDeliveryId === method.id}
                          value={String(method.id)}
                        />
                      ))}
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="space-y-4 w-full bg-card p-2 rounded-md">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Chọn hình thức thanh toán
                </h2>
                <p className="text-sm text-muted-foreground">
                  Chọn phương thức thanh toán an toàn
                </p>
              </div>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="space-y-3">
                      {paymentMethods.map((method, idx) => (
                        <PaymentOption
                          key={idx}
                          method={method}
                          value={method.id}
                        />
                      ))}
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </div>

          {/* Right Panel - Summary */}
          {checkoutItems && (
            <div className="lg:col-span-1">
              <SummaryCard
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                selectedItems={selectedItems}
                onOrder={handleOpenConfirmModal}
              />
            </div>
          )}
        </form>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmCheckout}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isSubmitting}
        selectedDelivery={deliveryMethods.find(
          (item) => item.id === selectedDeliveryId,
        )}
        selectedPaymentMethod={getValues('paymentMethod')}
        totalAmount={subtotal}
      />
    </main>
  );
};
