import AppSidebar from '@/components/sidebar-user/app-sidebar-user';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import { ReactElement } from 'react';

export default function ListVerticalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <div className="container mx-auto max-w-7xl px-0 md:px-4">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className='bg-transparent h-fit w-full rounded-xl flex flex-col gap-2'>
            <div className="flex items-center px-4 md:hidden bg-white dark:bg-black py-2 sticky top-0 z-10 border-b border-border">
              <SidebarTrigger className='-ml-2' />
              <span className="font-semibold ml-2">Tài khoản</span>
            </div>
            <div className='bg-white h-full min-h-[500px] dark:bg-black w-full rounded-none md:rounded-xl p-2 md:p-6 overflow-hidden'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </GuardLayoutWrapper>
  );
}
