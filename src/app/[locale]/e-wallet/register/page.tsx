import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import RegisterPage from '@/views/pages/e-wallet/register';
import { ReactElement } from 'react';

export default function Page() {
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={true}
      guestGuard={false}
    >
      <RegisterPage />
    </GuardLayoutWrapper>
  );
}
