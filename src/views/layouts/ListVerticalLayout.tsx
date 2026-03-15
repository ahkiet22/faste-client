import { AppSidebarSeller } from '@/components/sidebar-seller/app-sidebar-seller';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ROUTE_CONFIG } from '@/configs/router';
import useFindMenu from '@/hooks/use-find-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ModeToggle } from '@/components/ModeToggle';
import LocaleSwitcher from '@/components/locale-switcher';

export default function ListVerticalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const findMenuSelect = useFindMenu(pathname);
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <AppSidebarSeller />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#F5F5F5] dark:bg-[#121212]">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <Link href={ROUTE_CONFIG.SELLER.DASHBOARD}>
                    {t('navigation.home')}
                  </Link>
                </BreadcrumbItem>
                {findMenuSelect.parent &&
                  findMenuSelect.parent.url !==
                    ROUTE_CONFIG.SELLER.DASHBOARD && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {t(findMenuSelect.parent.title)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                {findMenuSelect.child && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {t(findMenuSelect.child.title)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-1 pr-2">
              <LocaleSwitcher />
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F5F5F5] dark:bg-[#121212]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
