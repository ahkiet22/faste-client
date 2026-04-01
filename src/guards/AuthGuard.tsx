'use client';

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react';

// ** Next
import { usePathname, useRouter } from 'next/navigation';

// ** Helper
import { useAuth } from '@/hooks'
import { getLocalUserData, clearLocalUserData } from '@/helpers/storage';
import { createUrlQuery } from '@/utils/create-query-url';
import { useTranslation } from 'react-i18next';
import { i18nConfig } from '@/i18n-config';

// ** Hook

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  // ** props
  const { children, fallback } = props;

  // ** auth
  const {loading, user, setUser} = useAuth();

  // ** router
  const router = useRouter();
  const pathName = usePathname();
  const { i18n } = useTranslation();

  const langValue = i18n.language;

  const urlDefault =
    langValue === i18nConfig.defaultLocale ? '/' : `/${langValue}`;
  const urlLogin =
    langValue === i18nConfig.defaultLocale ? '/logins' : `/${langValue}/login`;

  useEffect(() => {
    if (
      user === null &&
      !getLocalUserData().accessToken &&
      !getLocalUserData().userData
    ) {
      if (pathName !== urlDefault && pathName !== urlLogin) {
        router.replace('/login' + '?' + createUrlQuery('returnUrl', pathName));
      } else {
        router.replace('/login');
      }
      setUser(null)
      clearLocalUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  if (loading || user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
