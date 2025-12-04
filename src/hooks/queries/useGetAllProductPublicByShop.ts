import { QUERY_KEYS } from '@/constants/query-keys';
import { getAllProductsPublicByShop } from '@/services/product';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetAllProductPublicByShop = (
  shopId: number,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTSSHOP, shopId],
    queryFn: async () => {
      const response = await getAllProductsPublicByShop(shopId);
      return response.data;
    },
    ...options,
  });
};
