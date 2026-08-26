import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { uploadFile } from '@/services/media.service';

export const useMutationUploadFile = (
  options?: Omit<
    UseMutationOptions<any, unknown, { file: File; isPublic?: boolean }>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async ({ file, isPublic = true }) => {
      const res = await uploadFile(file, isPublic);
      return res.data;
    },
    ...options,
  });
};
