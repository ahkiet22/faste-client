export type CreateOrderType = {
  addressShipId: number;
  shopId: number;
  deliveryId: number;
  paymentMethod: 'COD' | 'SEPAY' | 'WEB3';
  cartItemIds: number[];
}[];

export type OrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'PROCESSING'
  | 'PENDING_PAYMENT'
  | 'PENDING_PICKUP'
  | 'PENDING_DELIVERY'
  | 'DELIVERED'
  | 'RECEIVED'
  | 'RETURNED'
  | 'CANCELLED';
