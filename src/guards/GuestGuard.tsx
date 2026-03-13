'use client';

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react';

// ** Next
import { usePathname, useRouter } from 'next/navigation';

// ** Helper
import { useAuth } from '@/hooks/use-auth';
import { getLocalUserData } from '@/helpers/storage';

// ** Hook

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  // ** props
  const { children, fallback } = props;

  // ** auth
  const authContext = useAuth();

  // ** router
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (getLocalUserData().accessToken && authContext.user) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  if (
    authContext.loading ||
    (!authContext.loading && authContext.user !== null)
  ) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
