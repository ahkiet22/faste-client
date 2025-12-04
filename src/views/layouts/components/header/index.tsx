'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import LocaleSwitcher from '@/components/locale-switcher';
import { ModeToggle } from '@/components/ModeToggle';
import { cn } from '@/lib/utils';
import PromoBar from './PromoBar';
import { useAuth } from '@/hooks/use-auth';
import { getCartByMe } from '@/services/cart';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { TopNavigation } from './TopNavigation';
import BottomNavigation from './BottomNavigation';

const SearchHeader = dynamic(() => import('./SearchHeader'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const UserDropdownMenu = dynamic(() => import('./UserDropdownMenu'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const MobileNavigation = dynamic(() => import('./mobile/MobileNavigation'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const MobileTopNavigation = dynamic(
  () => import('./mobile/MobileTopNavigation'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemList, SetCartItemList] = useState<any[] | null>(null);
  const router = useRouter();
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const handleNavigateUtils = (path: string) => {
    router.replace(path);
  };

  const fetchDataCartItem = async () => {
    try {
      const res = await getCartByMe();
      if (res.statusCode === 200) {
        SetCartItemList(res.data.data);
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  useEffect(() => {
    fetchDataCartItem();
  }, []);

  const totalCartItem = cartItemList?.reduce((total, item) => {
    return total + (item.cartItems.length ?? 0);
  }, 0);

  return (
    <header className="bg-background border-b border-border">
      {/* Promo Bar */}
      <PromoBar />

      {/* Top Navigation */}
      <div className="hidden md:block bg-muted/30">
        <TopNavigation />
      </div>

      {/* Main Header */}
      <div className="bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Image
                src="/next.svg"
                width={40}
                height={40}
                alt="FastE3 logo"
                className="dark:invert"
              />
              {/* <span className="font-bold text-xl text-foreground hidden sm:block">
                  FastE3
                </span> */}
            </div>

            {/* Location (Hidden on mobile) */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Icon icon="akar-icons:location" className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <SearchHeader />

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-muted-foreground hover:text-foreground"
              >
                <Icon
                  icon="material-symbols-light:search"
                  className="w-5 h-5"
                />
              </Button>

              {/* User Profile */}
              {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNavigateLogin}
                  className="text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  
                </Button> */}

              {/* UserDropdownMenu */}
              <UserDropdownMenu />

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-muted-foreground hover:text-purple-600 transition-colors"
              >
                <Icon
                  icon="material-symbols:favorite-outline"
                  className="w-5 h-5"
                />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500"
                >
                  2
                </Badge>
              </Button>

              {/* Cart */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  <Icon icon="f7:cart" className="w-5 h-5" />
                  {cartItemList && (
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
                  <div className="text-sm text-gray-300 px-2">
                    Sản Phẩm Mới Thêm
                  </div>
                  {cartItemList ? (
                    <div className="mb-4 max-w-[400px] max-h-[400px]">
                      {cartItemList.map((ci, indexCi: number) => (
                        <div key={ci.shop.shopid + indexCi}>
                          {ci.cartItems.map((item: any, indexItem: number) => (
                            <div
                              key={indexCi + indexItem + item.id + item.sku.id}
                              className="flex items-start max-w-[400px] max-h-14 hover:bg-gray-100 p-2"
                              onClick={() =>
                                handleNavigateUtils(
                                  `product/${item.sku.product.slugId}`,
                                )
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
                    <div className="text-xs text-gray-300">
                      83 Sản phẩm trong giỏ
                    </div>
                    <Link href={'/cart'} className="cursor-pointer">
                      <Button className="cursor-pointer">Xem giỏ hàng</Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <ModeToggle />

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon="material-symbols:menu" className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-4 p-4">
                    {/* Mobile Search */}
                    <div className="md:hidden pt-4">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search products..."
                          className="pr-10 bg-muted/50 border-0 rounded-2xl"
                        />
                        <Button
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl"
                        >
                          <Icon
                            icon="material-symbols-light:search"
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <MobileNavigation setIsOpen={setIsOpen} />

                    {/* Mobile Top Nav Items */}
                    <MobileTopNavigation setIsOpen={setIsOpen} />

                    {/* Mobile Locale Switcher */}
                    <div className="border-t border-border pt-4">
                      <LocaleSwitcher />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Desktop) */}
      <BottomNavigation />
    </header>
  );
};

export default Header;
