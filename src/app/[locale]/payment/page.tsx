import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import PaymentPage from '@/views/pages/payment';
import { ReactElement } from 'react';

export default function Page() {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <PaymentPage />
    </GuardLayoutWrapper>
  );
}
