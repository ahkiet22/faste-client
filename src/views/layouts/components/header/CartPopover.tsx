'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import React, { useCallback } from 'react';

interface CartPopoverProps {
  totalCartItem: number;
  data: any;
}

function CartPopover({ totalCartItem, data }: CartPopoverProps) {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigateUtils = useCallback(
    (path: string) => {
      router.replace(path);
    },
    [router],
  );

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="relative text-muted-foreground hover:text-purple-600 transition-colors"
      >
        <Icon icon="f7:cart" className="w-5 h-5" />
        {data && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500"
          >
            {totalCartItem}
          </Badge>
        )}
      </Button>
      <div
        className={`absolute right-0 z-10 py-2 hidden w-90 space-y-1 bg-white dark:bg-gray-900 shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-300 rounded-sm ${user ? 'group-hover:block' : ''}`}
      >
        <div className="text-sm text-gray-300 px-2">Sản Phẩm Mới Thêm</div>
        {data ? (
          <div className="mb-4 max-w-[400px] max-h-[400px]">
            {data.map((ci: any, indexCi: number) => (
              <div key={ci.shop.shopid + indexCi}>
                {ci.cartItems.map((item: any, indexItem: number) => (
                  <div
                    key={indexCi + indexItem + item.id + item.sku.id}
                    className="flex items-start max-w-[400px] max-h-14 hover:bg-gray-100 p-2"
                    onClick={() =>
                      handleNavigateUtils(`product/${item.sku.product.slugId}`)
                    }
                  >
                    <div className="w-10 h-10 border border-gray-200">
                      {item.sku.product.images[0] ? (
                        <Image
                          width={100}
                          height={100}
                          src={'/nftt-2.png'}
                          alt={item.sku.product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Icon icon={'fluent-mdl2:product'} />
                      )}
                    </div>
                    <div className="pl-2 w-full h-full flex-1 flex justify-between items-start">
                      <div className="text-sm max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.sku.product.name}
                      </div>
                      <div className="text-sm text-red-500">
                        {formatCurrencyWithExchange(item.sku.price, {
                          language: i18n.language as 'vi' | 'en',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div>Not found</div>
        )}
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-gray-300">{`${totalCartItem ? totalCartItem : 0} Sản phẩm trong giỏ`}</div>
          <Link href={'/cart'} className="cursor-pointer">
            <Button className="cursor-pointer">Xem giỏ hàng</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CartPopover);
