'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import LocaleSwitcher from '@/components/locale-switcher';
import { ModeToggle } from '@/components/ModeToggle';
import { ROUTE_CONFIG } from '@/configs/router';
import { createUrlQuery } from '@/utils/create-query-url';
import { cn } from '@/lib/utils';
import PromoBar from './PromoBar';
import { useAuth } from '@/hooks/use-auth';
import { getCartByMe } from '@/services/cart';
import { formatCurrencyWithExchange } from '@/utils';
import { useTranslation } from 'react-i18next';

const Header = React.memo(
  () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItemList, SetCartItemList] = useState<any[] | null>(null);
    const router = useRouter();
    const pathName = usePathname();
    const { user, logout } = useAuth();
    const { i18n } = useTranslation();

    const handleNavigateLogin = () => {
      if (pathName !== '/') {
        router.replace(
          ROUTE_CONFIG.LOGIN + '?' + createUrlQuery('returnUrl', pathName),
        );
      } else {
        router.replace('/login');
      }
    };

    const handleNavigateMyAccount = () => {
      router.replace(ROUTE_CONFIG.USER.INFO.ACCOUNT);
    };

    const handleNavigateUtils = (path: string) => {
      router.replace(path);
    };

    const navigationItems = [
      {
        href: '/',
        label: 'Home',
        icon: 'material-symbols:home-outline',
        hasDropdown: true,
      },
      { href: '/shop', label: 'Shop', icon: 'iconoir:shop', hasDropdown: true },
      {
        href: '/fruits-vegetables',
        label: 'Fruits & Vegetables',
        icon: 'lucide:apple',
      },
      { href: '/beverages', label: 'Beverages', icon: 'line-md:coffee-loop' },
      { href: '/blog', label: 'Blog', icon: 'mdi:file-text-outline' },
      {
        href: '/contact',
        label: 'Contact',
        icon: 'material-symbols:mail-outline',
      },
    ];

    const topNavItems = [
      { href: '/about', label: 'About us' },
      { href: '/sellercenter/dashboard', label: 'My Shop' },
      { href: '/wishlist', label: 'Wishlist' },
    ];

    const rightNavItems = [
      { href: '/my-account', label: 'My account' },
      { href: '/support', label: 'Support' },
    ];

    const fetchDataCartItem = async () => {
      try {
        const res = await getCartByMe();
        if (res.statusCode === 200) {
          console.log('RES CART', res.data.data);

          SetCartItemList(res.data.data);
        }
      } catch (error) {
        console.log('ERROR', error);
      }
    };

    useEffect(() => {
      console.log('REUN!');
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
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between py-2 text-xs text-muted-foreground">
              <nav className="flex items-center gap-4">
                <ul className="flex items-center gap-4">
                  {topNavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="w-px h-4 bg-border"></div>
                <p className="text-xs">
                  We deliver to you every day from{' '}
                  <span className="text-orange-600 font-semibold">7:00</span> to{' '}
                  <span className="text-orange-600 font-semibold">23:00</span>
                </p>
              </nav>

              <ul className="flex items-center gap-4">
                <li>
                  <LocaleSwitcher />
                </li>
                {rightNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
                <span className="font-bold text-xl text-foreground hidden sm:block">
                  FastE3
                </span>
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
              <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search for products, categories or brands..."
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

                <div className="group relative">
                  <Button
                    variant="ghost"
                    size={'sm'}
                    onClick={
                      !user ? handleNavigateLogin : handleNavigateMyAccount
                    }
                    className="inline-flex items-center text-muted-foreground hover:text-purple-600 transition-colors"
                  >
                    <Icon icon="lucide:user-round" className="w-5 h-5" />
                  </Button>
                  <div
                    className={`absolute right-0 z-10 hidden w-56 space-y-1 bg-white dark:bg-gray-900 py-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-sm ${user ? 'group-hover:block' : ''}`}
                  >
                    <Link
                      href={ROUTE_CONFIG.USER.INFO.ACCOUNT}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      prefetch={false}
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link
                      href={ROUTE_CONFIG.USER.ORDER.ORDER_LIST}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      prefetch={false}
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      prefetch={false}
                    >
                      Trung tâm trợ giúp
                    </Link>
                    <div
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={logout}
                    >
                      Đăng xuất
                    </div>
                  </div>
                </div>

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
                            {ci.cartItems.map(
                              (item: any, indexItem: number) => (
                                <div
                                  key={
                                    indexCi + indexItem + item.id + item.sku.id
                                  }
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
                                      {formatCurrencyWithExchange(
                                        item.sku.price,
                                        {
                                          language: i18n.language as
                                            | 'vi'
                                            | 'en',
                                        },
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
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
                      <nav className="flex flex-col space-y-4">
                        {navigationItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 text-foreground hover:text-purple-600 transition-colors py-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon icon={item.icon} className="w-5 h-5" />
                            <span>{item.label}</span>
                            {item.hasDropdown && (
                              <Icon
                                icon="icon-park-outline:down"
                                className="w-4 h-4 ml-auto"
                              />
                            )}
                          </Link>
                        ))}
                      </nav>

                      {/* Mobile Top Nav Items */}
                      <div className="border-t border-border pt-4">
                        <div className="flex flex-col space-y-3">
                          {[...topNavItems, ...rightNavItems].map((item) => (
                            <Link
                              key={item.href}
                              href={'/'}
                              className="text-muted-foreground hover:text-foreground transition-colors py-1"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>

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
        <div className="hidden lg:block bg-background border-t border-border">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between py-4">
              <nav className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors',
                      'text-muted-foreground hover:text-purple-600',
                      item.label === 'Home' && 'text-foreground',
                    )}
                  >
                    <Icon icon={item.icon} className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <Icon icon="icon-park-outline:down" className="w-4 h-4" />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Trending Products</span>
                  <Icon icon="icon-park-outline:down" className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-600 font-medium">
                    Almost Finished
                  </span>
                  <Badge
                    variant="destructive"
                    className="bg-red-500 text-xs px-2 py-1 rounded-md"
                  >
                    SALE
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  },
  () => true,
);

Header.displayName = 'Header';

export default React.memo(Header);
