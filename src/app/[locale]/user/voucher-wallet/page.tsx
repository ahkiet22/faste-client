import type React from 'react';
import { Metadata } from 'next';
import { VoucherWalletPage } from '@/views/pages/user/voucher-wallet';

export const metadata: Metadata = {
  title: 'Mã giảm giá | FastE'
}

export default function Page() {
  return <VoucherWalletPage />;
}
