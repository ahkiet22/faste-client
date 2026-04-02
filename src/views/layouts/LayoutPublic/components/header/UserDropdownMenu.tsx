"use client";

import { Button } from '@/components/ui/button';
import { ROUTE_CONFIG } from '@/configs/router';
import { useAuth } from '@/hooks'
import { createUrlQuery } from '@/utils/create-query-url';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const UserDropdownMenu = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathName = usePathname();
  const {t} = useTranslation()

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

  console.log('user', user);
  
  return (
    <div className="group relative">
      <Button
        variant="ghost"
        size={'sm'}
        onClick={!user ? handleNavigateLogin : handleNavigateMyAccount}
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
          {t('account.accountInfo')}
        </Link>
        <Link
          href={ROUTE_CONFIG.USER.ORDER.ORDER_LIST}
          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          prefetch={false}
        >
          {t('userMenu.myOrders')}
        </Link>
        <Link
          href="#"
          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          prefetch={false}
        >
         {t('support.helpCenter')}
        </Link>
        <div
          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          onClick={logout}
        >
          {t('navigation.logout')}
        </div>
      </div>
    </div>
  );
};

export default UserDropdownMenu;
