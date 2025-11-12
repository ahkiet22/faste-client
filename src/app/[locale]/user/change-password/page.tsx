import { ChangePasswordPage } from '@/views/pages/user/change-password';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu | FastE',
};

export default function Page() {
  return (
    <>
      <ChangePasswordPage />
    </>
  );
}
