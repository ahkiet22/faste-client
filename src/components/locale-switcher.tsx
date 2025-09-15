'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { LANGUAGE_OPTIONS } from '@/configs/i18n';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectLang, setSelectLang] = useState(LANGUAGE_OPTIONS[0].lang);

  // Cập nhật ngôn ngữ khi pathname thay đổi
  useEffect(() => {
    if (pathname) {
      const segments = pathname.split('/');
      const currentLang = segments[1]; // Phần tử đầu tiên trong pathname là ngôn ngữ
      setSelectLang(
        LANGUAGE_OPTIONS.find((lang) => lang.value === currentLang)?.lang ||
          LANGUAGE_OPTIONS[0].lang,
      );
    }
  }, [pathname]);

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const handleLangChange = (locale: Locale, lang: string) => {
    setSelectLang(lang);
    router.push(redirectedPathname(locale));
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center gap-x-1">
            <Icon icon="solar:global-linear" width="18" height="18" />
            <div>{selectLang}</div>
            <Icon icon="icon-park-outline:down" width="18" height="18" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LANGUAGE_OPTIONS.map((lang) => {
            return (
              <DropdownMenuItem key={lang.value}>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Ngừng việc chuyển trang mặc định
                    handleLangChange(lang.value, lang.lang);
                  }}
                >
                  {lang.lang}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
