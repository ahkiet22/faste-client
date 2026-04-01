'use client';
// ** hooks
import { useAuth } from '@/hooks'
// ** React Imports
import { ReactNode, ReactElement, useEffect, memo } from 'react';

interface PublicGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const PublicGuard = memo((props: PublicGuardProps) => {
  // ** props
  const { children, fallback } = props;

  // ** auth
  const { loading } = useAuth();

  if (loading) {
    return fallback;
  }

  return <>{children}</>;
});

PublicGuard.displayName = 'PublicGuard';

export default PublicGuard;
