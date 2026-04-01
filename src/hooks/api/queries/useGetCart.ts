import { QUERY_KEYS } from '@/constants/query-keys';
import { getCartByMe } from '@/services/cart';
import { useCartStore } from '@/stores/cart-store';
import { TParamsGets } from '@/types/common';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetCart = (
  params: TParamsGets,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) => {
  const setTotalCartItem = useCartStore((s) => s.setTotalCartItem);
  return useQuery({
    queryKey: [QUERY_KEYS.CART, params],
    queryFn: async () => {
      const response = await getCartByMe(params);
      setTotalCartItem(response.data?.totalItem || 0);
      return response.data;
    },
    ...options,
  });
};
