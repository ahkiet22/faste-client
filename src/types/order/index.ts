import { TPagination } from '../params';

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

export interface IParamsOrder extends TPagination {
  status?: OrderStatus;
  keyword?: string;
}

export type PaymentMethod =
  | 'COD'
  | 'BANK_TRANSFER'
  | 'CREDIT_CARD'
  | 'E_WALLET';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  productName: string;
  skuPrice: number;
  image: string;
  skuAttributes?: Record<string, string>;
  quantity?: number;
}

export interface OrderPayment {
  id: number;
  transactionId?: number | string | null;
  amount: number;
  status: PaymentStatus | string;
  paidAt: string | null;
}

export interface OrderShop {
  id?: number;
  name: string;
  slug: string;
  avatar?: string;
}

export interface AddressShip {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  ward?: string;
  isDefault?: boolean;
}

export interface Order {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod | string;
  Payment: OrderPayment;
  Shop: OrderShop;
  items: OrderItem[];
  deliveryId?: number | null;
  addressShipId?: number | null;
  addressShip?: AddressShip | null;
  voucherId?: number | null;
  note?: string;
}

export interface GetOrdersByShopResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    data: Order[];
    total?: number;
    page?: number;
    limit?: number;
  };
}
