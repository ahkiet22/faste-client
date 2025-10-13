import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import HistoryPage from '@/views/pages/e-wallet/history';
import { ReactElement } from 'react';

export default function Page() {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <HistoryPage />
    </GuardLayoutWrapper>
  );
}
