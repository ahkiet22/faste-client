'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { useAuth } from '@/hooks'

type AclGuardProps = {
  children: ReactNode;
  roles?: string[];
  fallback?: ReactNode;
};

export default function AclGuard({ children, roles = [], fallback }: AclGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (roles.length && !roles.includes(user.role.name.toUpperCase())) {
        router.replace('/');
      }
    }
  }, [user, loading, roles, router]);

  if (loading) {
    return fallback || <LoadingDialog isLoading={true} message="" />;
  }

  if (!user) {
    return null;
  }

  if (roles.length && !roles.includes(user.role.name)) {
    return null;
  }

  return <>{children}</>;
}