import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import TransferPage from '@/views/pages/e-wallet/transfer';
import { ReactElement } from 'react';

export default function Page() {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <TransferPage />
    </GuardLayoutWrapper>
  );
}
