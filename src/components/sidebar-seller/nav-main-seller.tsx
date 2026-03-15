'use client';

import { ChevronRight } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { IMenuItem } from '@/configs/sidebar-items';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export function NavMainSeller({ items }: { items: IMenuItem[] }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { t } = useTranslation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            item.url === pathname ||
            item.items?.some((subItem) => subItem.url === pathname);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={t(item.title)}
                    className={`${
                      isParentActive ? 'text-blue-500 hover:!text-blue-500 hover:!bg-transparent' : ''
                    }`}
                  >
                    <Link
                      href={item.url || '#'}
                      className="flex items-center gap-2 text-sm"
                    >
                      {item.icon && (
                        <Icon icon={item.icon} width="18" height="18" />
                      )}
                      <span
                        className={`${state === 'collapsed' && 'hidden'}`}
                      >
                        {t(item.title)}
                      </span>
                    </Link>
                    {item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`${
                                isActive ? 'text-blue-500 bg-blue-100 hover:text-blue-500 hover:bg-blue-100 font-medium' : ''
                              }`}
                            >
                              <Link href={subItem.url!}>
                                <span>{t(subItem.title)}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
