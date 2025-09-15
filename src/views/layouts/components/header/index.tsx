import LocaleSwitcher from '@/components/locale-switcher';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTE_CONFIG } from '@/configs/router';
import { createUrlQuery } from '@/utils/create-query-url';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const pathName = usePathname();
  const handleNavigateLogin = () => {
    if (pathName !== '/') {
      router.replace(
        ROUTE_CONFIG.LOGIN + '?' + createUrlQuery('returnUrl', pathName),
      );
    } else {
      router.replace('/login');
    }
  };
  return (
    <header className=" bg-gray-50">
      <div className="bg-[#634C9F] p-2 flex items-center justify-around">
        <p className="text-xs text-white">
          FREE delivery & 40% Discount for next 3 orders! Place your 1st order
          in.
        </p>
        <div className="flex items-center justify-between gap-x-3.5 text-white">
          <div className="text-xs">Until the end of the sale:</div>
          <div>
            <span className="text-lg font-bold mr-0.5">47</span>
            <span className="text-xs">days</span>
          </div>
          <div>
            <span className="text-lg font-bold mr-0.5">06</span>
            <span className="text-xs">hours</span>
          </div>
          <div>
            <span className="text-lg font-bold mr-0.5">59</span>
            <span className="text-xs">minutes</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl text-xs text-[#6B7280] flex items-center justify-between p-2">
        <nav className="flex items-center gap-x-4">
          <ul className="flex items-center gap-x-3.5">
            <li>
              <Link href="/about">About us</Link>
            </li>
            <li>
              <Link href="/my-account">My account</Link>
            </li>
            <li>
              <Link href="/wishlist">Wishlist</Link>
            </li>
          </ul>

          <div className="w-[1px] h-6 bg-gray-300"></div>

          <p>
            We deliver to you every day from{' '}
            <span className="text-[#EA580C] font-semibold">7:00</span> to{' '}
            <span className="text-[#EA580C] font-semibold">23:00</span>
          </p>
        </nav>

        {/* Menu bên phải */}
        <ul className="flex items-center gap-x-3.5">
          <li className="cursor-pointer">
            <LocaleSwitcher />
          </li>
          <li>
            <Link href="/my-account">My account</Link>
          </li>
          <li>
            <Link href="/support">Support</Link>
          </li>
        </ul>
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
      <div className=" container mx-auto max-w-6xl flex items-center justify-between p-2">
        <div className="flex items-center">
          <div>
            <Image src={'/next.svg'} width={50} height={50} alt="logo" />
          </div>
          <div className="font-bold text-xl">FastE3</div>
        </div>
        <div>
          <Icon icon="akar-icons:location" width="24" height="24" />
        </div>
        <div className="flex-1 flex w-full max-w-2xl items-center gap-2">
          <Input
            className="bg-[#F3F4F6]"
            type="text"
            placeholder="Search for products, categories or brands..."
          />
          <Button>
            <Icon icon="material-symbols-light:search" width="24" height="24" />
          </Button>
        </div>
        <div
          className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
          onClick={handleNavigateLogin}
        >
          <Icon icon="lucide:user-round" width="24" height="24" />
        </div>
        <div className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors relative">
          <Icon
            icon="material-symbols:favorite-outline"
            width="24"
            height="24"
          />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </div>
        <div className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors relative">
          <Icon icon="f7:cart" width="24" height="24" />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </div>
        <ModeToggle />
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>

      <div className="bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 text-xs">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-6 py-4">
              <a
                href="#"
                className="flex items-center space-x-2 text-gray-900 font-medium hover:text-purple-600 transition-colors"
              >
                <Icon
                  icon="material-symbols:home-outline"
                  width="24"
                  height="24"
                />
                <span>Home</span>
                <Icon icon="icon-park-outline:down" width="24" height="24" />
              </a>

              <a
                href="#"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Icon icon="iconoir:shop" width="24" height="24" />
                <span>Shop</span>
                <Icon icon="icon-park-outline:down" width="24" height="24" />
              </a>

              <a
                href="#"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Icon icon="lucide:apple" width="24" height="24" />
                <span>Fruits & Vegetables</span>
              </a>

              <a
                href="#"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Icon icon="line-md:coffee-loop" width="24" height="24" />
                <span>Beverages</span>
              </a>

              <a
                href="#"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Icon icon="mdi:file-text-outline" width="24" height="24" />
                <span>Blog</span>
              </a>

              <a
                href="#"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Icon
                  icon="material-symbols:mail-outline"
                  width="24"
                  height="24"
                />
                <span>Contact</span>
              </a>
            </nav>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <span>Trending Products</span>
                <Icon icon="icon-park-outline:down" width="24" height="24" />
              </div>

              <div className="flex items-center space-x-2 text-red-600 ">
                <span>Almost Finished</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-sm">
                  SALE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
