import { NotificationPage } from '@/views/pages/user/notification';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cài đặt thông báo | FastE'
}

export default function Page() {
  return (
    <>
      <NotificationPage />
    </>
  );
}
