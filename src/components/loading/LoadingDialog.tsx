'use client';

import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingDialogProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingDialog({
  isLoading,
  message = 'Loading...',
}: LoadingDialogProps) {
  return (
    <Dialog open={isLoading} onOpenChange={() => {}}>
      <DialogContent
        className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm border-none shadow-none w-60 h-60 rounded-xl"
        showCloseButton={false}
      >
        <DialogTitle></DialogTitle>
        <LoadingSpinner size={48} className="text-white" />
        <p className="mt-4 text-white font-medium text-center">{message}</p>
      </DialogContent>
    </Dialog>
  );
}
