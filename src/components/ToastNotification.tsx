import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';

export const toastify = {
  success: (title: string, description?: string) =>
    toast.success(title, {
      description,
      position: 'top-right',
      richColors: true,
      cancel: {
        label: <Icon icon="material-symbols:close" width={18} height={18} />,
        onClick: () => toast.dismiss(),
      },
      cancelButtonStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent',
      },
    }),

  error: (title: string, description?: string) =>
    toast.error(title, {
      description,
      position: 'top-right',
      richColors: true,
      cancel: {
        label: <Icon icon="material-symbols:close" width={18} height={18} />,
        onClick: () => toast.dismiss(),
      },
      cancelButtonStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent',
      },
    }),

  info: (title: string, description?: string) =>
    toast(title, {
      description,
      position: 'top-right',
      richColors: true,
      cancel: {
        label: <Icon icon="material-symbols:close" width={18} height={18} />,
        onClick: () => toast.dismiss(),
      },
      cancelButtonStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent',
      },
    }),
};
