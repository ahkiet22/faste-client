export const topNavItems = [
  { href: '/about', label: 'navigation.about' },
  { href: '/sellercenter/dashboard', label: 'navigation.myShop' },
  { href: '/wishlist', label: 'navigation.wishlist' },
];

export const rightNavItems = [
  { href: '/user/account', label: 'navigation.myAccount' },
  { href: '/support', label: 'navigation.support' },
];

export const navigationItems = [
  {
    href: '/',
    label: 'navigation.home',
    icon: 'material-symbols:home-outline',
    hasDropdown: true,
  },
  {
    href: '/shop',
    label: 'navigation.shop',
    icon: 'iconoir:shop',
    hasDropdown: true,
  },
  {
    href: '#',
    label: 'navigation.fruitsVegetables',
    icon: 'lucide:apple',
  },
  { href: '/#', label: 'navigation.beverages', icon: 'line-md:coffee-loop' },
  { href: '/blog', label: 'navigation.blog', icon: 'mdi:file-text-outline' },
  {
    href: '/contact',
    label: 'navigation.contact',
    icon: 'material-symbols:mail-outline',
  },
];
