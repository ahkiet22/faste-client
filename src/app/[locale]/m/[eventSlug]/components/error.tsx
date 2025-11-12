// app/m/[eventSlug]/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Đã có lỗi xảy ra!
        </h2>
        <p className="text-gray-600 mb-8">
          Không thể tải trang sự kiện. Vui lòng thử lại.
        </p>
        <Button onClick={reset} className="bg-red-500 hover:bg-red-600">
          Thử lại
        </Button>
      </div>
    </div>
  );
}