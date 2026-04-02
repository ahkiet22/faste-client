import dayjs from 'dayjs';
import { ProductRating } from '@/components/ProductRating';
import Image from 'next/image';
import { Icon } from '@iconify/react';

type ReviewCardProps = {
  review: any;
  skus: any[];
};

export const ReviewCard = ({ review, skus }: ReviewCardProps) => {
  const sku = skus.find((sku) => sku.id === review.skuId);
  const attributeText = Object.entries(sku.attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' • ');
  return (
    <div className="border-b border-gray-200 py-4 flex gap-x-4">
      {/* Avatar */}
      {review.createdBy.avatar ? (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
          <Image
            width={100}
            height={100}
            src={review.createdBy.avatar}
            alt={review.createdBy.name}
          />
        </div>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium"></div>
        </>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">
              {review.isAnonymous
                ? 'Người dùng ẩn danh'
                : `User ${review.createdBy.name}`}
            </div>
            <ProductRating rating={review.rating ?? 0} size={14} />
          </div>

          <div className="text-xs text-gray-400">
            <div>{dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}</div>
          </div>
        </div>
        {review.skuId && (
          <div className="text-xs text-gray-400">{attributeText}</div>
        )}

        {/* Message */}
        {review.message && (
          <div className="mt-2 text-sm text-gray-700">{review.message}</div>
        )}

        {/* Images */}
        {review.images?.length > 0 && (
          <div className="flex gap-2 mt-2">
            {review.images.map((img: string, idx: number) => (
              <Image
                width={100}
                height={100}
                key={idx}
                src={img}
                alt="review"
                className="w-20 h-20 object-cover rounded-md border"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-x-4 mt-3 text-xs text-gray-500">
          <button className="hover:text-red-500">
            <Icon icon="mdi:like" width="18" height="18" />
          </button>
          <button className="hover:text-red-500">
            <Icon icon="material-symbols:report" width="18" height="18" />
          </button>
        </div>
      </div>
    </div>
  );
};
