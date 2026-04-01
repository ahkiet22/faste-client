import { QUERY_KEYS } from '@/constants/query-keys';
import { getAllCategories } from '@/services/category';
import { TParamsGets } from '@/types/common';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetCategories = (
  params: TParamsGets,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, params],
    queryFn: async () => {
      const response = await getAllCategories(params);
      return response.data;
    },
    ...options,
  });
};
