import { memo } from 'react';

export const ProductReviews = memo(() => {
  return (
    <div className="flex items-start justify-between gap-x-8 bg-white dark:bg-black w-full p-4">
      <div className="uppercase font-medium">Đánh giá sản phẩm</div>
    </div>
  );
});

ProductReviews.displayName = 'ProductReviews';
