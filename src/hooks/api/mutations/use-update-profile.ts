import { QUERY_KEYS } from '@/constants/query-keys';
import { updateProfile } from '@/services/profile';
import { TUpdateProfile } from '@/types/profile';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const useMutationUpdateProfile = (
  options?: Omit<
    UseMutationOptions<any, unknown, TUpdateProfile>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await updateProfile(data);

      return res.data;
    },
    mutationKey: [QUERY_KEYS.UPDATE_PROFILE],
    ...options,
  });
};
