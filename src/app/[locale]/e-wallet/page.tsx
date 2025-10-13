import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import EWalletPage from '@/views/pages/e-wallet';
import { ReactElement } from 'react';

export default function Home() {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <EWalletPage />
    </GuardLayoutWrapper>
  );
}
