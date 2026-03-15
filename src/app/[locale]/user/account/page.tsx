import type React from 'react';
import AccountPage from '@/views/pages/user/account';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

export const metadata: Metadata = {
  title: 'Thông tin cá nhân | FastE',
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingDialog isLoading />}>
      <AccountPage />
    </Suspense>
  );
}
