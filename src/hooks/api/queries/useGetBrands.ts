import { QUERY_KEYS } from '@/constants/query-keys';
import { getAllBrands } from '@/services/brand';
import { TParamsGets } from '@/types/common';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetBrands = (
  params: TParamsGets,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BRAND, params],
    queryFn: async () => {
      const response = await getAllBrands(params);
      return response.data;
    },
    ...options,
  });
};
