import { QUERY_KEYS } from '@/constants/query-keys';
import { getAllImagesInDB } from '@/services/media.service';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetMedia = (
  params: { page?: number; limit?: number } = { page: 1, limit: 100 },
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEDIA, params],
    queryFn: async () => {
      const response = await getAllImagesInDB(params);
      return response.data; // This returns the paginated object: { data: [...], page, limit, totalPage }
    },
    ...options,
  });
};
