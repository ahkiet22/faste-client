import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import AdminDashboardPage from '@/views/pages/admin/dashboard';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading template...</div>}>
      {/* <GuardLayoutWrapper layout="admin" guard="acl"> */}
        <AdminDashboardPage />
      {/* </GuardLayoutWrapper> */}
    </Suspense>
  );
}
