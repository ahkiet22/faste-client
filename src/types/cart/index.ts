export interface AddToCartRequest {
  skuId: number;
  quantity: number;
}

export interface UpdateCartQuantityRequest {
  id: number;
  skuId: number;
  quantity: number;
}
