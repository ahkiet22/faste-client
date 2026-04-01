import { QUERY_KEYS } from '@/constants/query-keys';
import { getProfile } from '@/services/profile';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetProfile = (
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: async () => {
      const response = await getProfile();
      return response.data;
    },
    ...options,
  });
};
