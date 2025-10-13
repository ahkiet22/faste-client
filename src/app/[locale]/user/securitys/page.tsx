import AddressPage from '@/views/pages/user/address';
import { SecurityPage } from '@/views/pages/user/securitys';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảo mật | FastE'
}

export default function Page() {
  return (
    <>
      <SecurityPage />
    </>
  );
}
