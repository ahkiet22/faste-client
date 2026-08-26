import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { uploadMultipleFiles } from '@/services/media.service';

export const useMutationUploadMultipleFiles = (
  options?: Omit<
    UseMutationOptions<any, unknown, { files: File[]; isPublic?: boolean }>,
    'mutationFn'
  >,
) => {
  return useMutation({
    mutationFn: async ({ files, isPublic = false }) => {
      const res = await uploadMultipleFiles(files, isPublic);
      return res.data;
    },
    ...options,
  });
};
