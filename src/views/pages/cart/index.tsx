'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShopSection } from './partials/shop-section';
import { SummaryCard } from './partials/summary-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import {
  deleteCartItem,
  getCartByMe,
  updateCartQuantity,
} from '@/services/cart';
import { setCheckoutItems } from '@/helpers/storage';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/use-debounce';
import { UpdateCartQuantityRequest } from '@/types/cart';
import { se } from 'date-fns/locale';
import { ShopSectionSkeleton } from './partials/ShopSectionSkeleton';
import { useTranslation } from 'react-i18next';

export default function CartPage() {
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);

  const [cartItemList, SetCartItemList] = useState<any[] | null>(null);
  const router = useRouter();
  const {t} = useTranslation();

  const fetchDataCartItem = async () => {
    try {
      const res = await getCartByMe();
      if (res.statusCode === 200) {
        SetCartItemList(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataCartItem();
  }, []);

  const handleQuantityChange = (
    id: number,
    skuId: number,
    quantity: number,
  ) => {
    SetCartItemList((prev: any) => {
      return prev?.map((group: any) => {
        return {
          ...group,
          cartItems: group.cartItems.map((item: any) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        };
      });
    });
    setPendingUpdate({ id, skuId, quantity });
  };

  const handleDelete = async (id: number) => {
    SetCartItemList((prev: any) => {
      return prev?.map((group: any) => {
        return {
          ...group,
          cartItems: group.cartItems.filter((item: any) => item.id !== id),
        };
      });
    });
    await deleteCartItem(id);
  };

  const handleSelect = (id: number, selected: boolean) => {
    if (cartItemList) {
      SetCartItemList(
        (items) =>
          items?.map((item) => ({
            ...item,
            cartItems: item.cartItems.map((i: any) =>
              i.id === id ? { ...i, isSelected: selected } : i,
            ),
          })) ?? [],
      );
    }
  };

  const handleSelectAll = (shopId: number, selected: boolean) => {
    if (cartItemList) {
      SetCartItemList(
        (items) =>
          items?.map((item) =>
            item.shop.shopid === shopId
              ? {
                  ...item,
                  cartItems: item.cartItems.map((i: any) => ({
                    ...i,
                    isSelected: selected,
                  })),
                }
              : item,
          ) ?? [],
      );
    }
  };

  const handleSelectAllItemCart = (selected: boolean) => {
    if (cartItemList) {
      SetCartItemList(
        (items) =>
          items?.map((item) => ({
            ...item,
            cartItems: item.cartItems.map((i: any) => ({
              ...i,
              isSelected: selected,
            })),
          })) ?? [],
      );
    }
  };
  const selectedItems = useMemo(() => {
    return (
      cartItemList?.flatMap((shop) =>
        shop.cartItems.filter((item: any) => item.isSelected),
      ) ?? []
    );
  }, [cartItemList]);
  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.sku.price * item.quantity,
      0,
    );
  }, [selectedItems]);
  const handleCheckoutProduct = useCallback(() => {
    if (selectedItems.length === 0) return;

    // Lọc lại các shop chỉ chứa item đã chọn
    const checkoutData = cartItemList
      ?.map((shop) => ({
        ...shop,
        cartItems: shop.cartItems.filter((item: any) => item.isSelected),
      }))
      .filter((shop) => shop.cartItems.length > 0);

    setCheckoutItems(checkoutData!);

    router.push('/checkout');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const allSelected = cartItemList?.every((shop) =>
    shop.cartItems.every((item: any) => item.isSelected),
  );

  // Calculate totals

  const shipping = selectedItems.length > 0 ? 0 : 0; // Free shipping for demo
  const discount = 0;
  const total = useMemo(
    () => subtotal + shipping - discount,
    [subtotal, shipping, discount],
  );

  const debouncedUpdate = useDebounce(pendingUpdate, 400);

  const updateCartQuantityApi = async (data: UpdateCartQuantityRequest) => {
    await await updateCartQuantity(data);
  };
  useEffect(() => {
    if (!debouncedUpdate) return;
    updateCartQuantityApi(debouncedUpdate);
  }, [debouncedUpdate]);

  console.log('==== render cart page', selectedItems);

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto p-2">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('navigation.cart')}</h1>
          <p className="text-muted-foreground">
            {cartItemList?.length} {t('navigation.products')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Cart Items */}
          <div className="lg:col-span-2">
            {cartItemList?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('cart.emptyCart')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-t-lg">
                  <div className="flex-shrink-0 w-6">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAllItemCart(checked as boolean)
                      }
                    />
                  </div>
                  <div className="flex-1 text-sm font-medium text-muted-foreground">
                    {t('navigation.products')}
                  </div>
                  <div className="flex-shrink-1 min-w-[120px] text-center text-sm font-medium text-muted-foreground">
                    {t('cart.unitPrice')}
                  </div>
                  <div className="flex-shrink-0 text-sm min-w-[120px] text-center font-medium text-muted-foreground">
                    {t('cart.quantity')}
                  </div>
                  <div className="flex-shrink-0 min-w-[120px] text-center text-sm font-medium text-muted-foreground">
                    {t('cart.totalPrice')}
                  </div>
                  <div className="flex-shrink-0 w-6">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {cartItemList ? 
                  cartItemList.map((CartShop) => (
                    <ShopSection
                      key={CartShop.shop.shopid}
                      CartShop={CartShop}
                      onQuantityChange={handleQuantityChange}
                      onDelete={handleDelete}
                      onSelect={handleSelect}
                      onSelectAll={handleSelectAll}
                    />
                  )) : (
                    <ShopSectionSkeleton />
                  )}
              </div>
            )}
          </div>

          {/* Right Panel - Summary */}
          <div className="lg:col-span-1">
            <SummaryCard
              subtotal={selectedItems ? subtotal : 0}
              shipping={selectedItems ? shipping : 0}
              discount={selectedItems ? discount : 0}
              total={selectedItems ? total : 0}
              selectedItems={selectedItems}
              onCheckout={handleCheckoutProduct}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
