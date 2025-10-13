import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import AddFundsPage from '@/views/pages/e-wallet/add-funds';
import { ReactElement } from 'react';

export default function Page() {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <AddFundsPage />
    </GuardLayoutWrapper>
  );
}
