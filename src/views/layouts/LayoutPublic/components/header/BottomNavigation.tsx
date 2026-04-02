import { Badge } from "@/components/ui/badge";
import { navigationItems } from "@/configs/header";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const { t } = useTranslation();
  const pathname = usePathname();
  return (
    <div className="hidden lg:block bg-background border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <nav className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors',
                  'text-muted-foreground hover:text-purple-600',
                  (pathname === item.href || (item.href === '/' && pathname.length <= 3)) && 'text-foreground',
                )}
              >
                <Icon icon={item.icon} className="w-5 h-5" />
                <span>{t(item.label)}</span>
                {item.hasDropdown && (
                  <Icon icon="icon-park-outline:down" className="w-4 h-4" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('navigation.trendingProducts')}</span>
              <Icon icon="icon-park-outline:down" className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600 font-medium">{t('navigation.almostFinished')}</span>
              <Badge
                variant="destructive"
                className="bg-red-500 text-xs px-2 py-1 rounded-md"
              >
                {t('navigation.sale')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
