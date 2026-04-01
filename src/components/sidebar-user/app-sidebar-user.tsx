'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from '../ui/sidebar';
import { USER_MENU_ITEMS } from '@/configs/sidebar-items';
import { NavMain } from './nav-main-user';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks';


export default function AppSidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Sidebar
      side="left"
      variant="floating"
      className="md:w-[300px] h-auto relative bg-transparent"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-4 mb-4 w-full h-auto">
            <div>
              {user ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={100}
                  height={100}
                  className="rounded-full w-15 h-15 object-cover object-center"
                />
              ) : (
                <Image
                  src={'/nftt-1.png'}
                  alt={'ok'}
                  width={100}
                  height={100}
                  className="rounded-full w-15 h-15 object-cover object-center"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium">
                {user?.name ? user?.name : t('common.customerName')}
              </h3>
            </div>
          </SidebarGroupLabel>
          <div className="w-full bg-[#dddd] h-[1px]"></div>
          <NavMain items={USER_MENU_ITEMS} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
