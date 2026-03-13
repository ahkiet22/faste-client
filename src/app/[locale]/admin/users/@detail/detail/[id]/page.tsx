import UserDetailModal from '@/views/pages/admin/users/detail-modal';

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailModal id={id} />;
}
