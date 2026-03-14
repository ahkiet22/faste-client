'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import LocaleSwitcher from '@/components/locale-switcher';
import PromoBar from './PromoBar';
import { TopNavigation } from './TopNavigation';
import BottomNavigation from './BottomNavigation';
import { useGetCart } from '@/hooks/queries/useGetCart';
import { keepPreviousData } from '@tanstack/react-query';
import { useCartStore } from '@/stores/cart-store';
import CartPopover from './CartPopover';
import SearchHeader from './SearchHeader';
import UserDropdownMenu from './UserDropdownMenu';
import MobileNavigation from './mobile/MobileNavigation';
import MobileTopNavigation from './mobile/MobileTopNavigation';
import { ModeToggle } from '@/components/ModeToggle';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const totalCartItemRef = useRef<number>(0);
  const { data, isLoading } = useGetCart(
    {
      page: 1,
      limit: 10,
    },
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );
  const totalCartItemStore = useCartStore((s) => s.totalCartItem);
  if (!isLoading) {
    totalCartItemRef.current = totalCartItemStore;
  }

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
                src="/logo.svg"
                width={120}
                height={24}
                alt="FastE3 logo"
                className="dark:invert w-auto h-16"
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
              <CartPopover
                data={data}
                totalCartItem={totalCartItemRef.current}
              />

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
