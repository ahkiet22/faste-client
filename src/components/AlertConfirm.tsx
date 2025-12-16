import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Icon } from '@iconify/react/dist/iconify.js';

type AlertType = 'warning' | 'info' | 'success' | 'error';

interface TProps {
  title?: string;
  description?: string;
  open: boolean;
  type?: AlertType;
  onConfirm: () => void;
  onClose: () => void;
  onCancel?: () => void;
}

export default function AlertConfirm({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  open,
  type = 'warning',
  onConfirm,
  onClose,
  onCancel,
}: TProps) {
  const iconMap: Record<AlertType, string> = {
    warning: 'si:warning-line',
    info: 'mdi:information-outline',
    success: 'mdi:check-circle-outline',
    error: 'mdi:alert-circle-outline',
  };

  const colorMap: Record<AlertType, string> = {
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400',
    error: 'text-red-400',
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-row">
          <Icon icon={iconMap[type]} className={`text-4xl ${colorMap[type]}`} />
          <div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="btn btn-destructive cursor-pointer"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
