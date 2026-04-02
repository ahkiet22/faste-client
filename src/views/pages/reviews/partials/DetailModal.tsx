import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export const DetailModal = ({ review, open, onOpenChange }: any) => {
  if (!review) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <Image
              width={64}
              height={64}
              src={review.productImage}
              alt="s"
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <p className="font-semibold">{review.productName}</p>
              <p className="text-sm text-gray-500">
                {review.sku} • {review.orderId}
              </p>
            </div>
          </div>
          <div>
            <div className="flex text-yellow-500 mb-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Icon
                    key={i}
                    icon={i < review.rating ? 'ph:star-fill' : 'ph:star'}
                  />
                ))}
            </div>
            <p className="text-gray-800">{review.content}</p>
            {review.images?.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.images.map((img: string, i: number) => (
                  <Image
                    width={80}
                    height={80}
                    alt="2"
                    key={i}
                    src={img}
                    className="w-20 h-20 rounded border object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
