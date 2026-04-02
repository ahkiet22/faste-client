import { navigationItems } from '@/configs/header';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default React.memo(function MobileNavigation({ setIsOpen }: TProps) {
  const { t } = useTranslation();
  return (
    <nav className="flex flex-col space-y-4">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 text-foreground hover:text-purple-600 transition-colors py-2"
          onClick={() => setIsOpen(false)}
        >
          <Icon icon={item.icon} className="w-5 h-5" />
          <span>{t(item.label)}</span>
          {item.hasDropdown && (
            <Icon icon="icon-park-outline:down" className="w-4 h-4 ml-auto" />
          )}
        </Link>
      ))}
    </nav>
  );
});
