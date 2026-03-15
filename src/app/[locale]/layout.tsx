import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { i18nConfig } from '@/i18n-config';
import TranslationProvider from '@/providers/TranslationProvider';
import initTranslations from '@/configs/i18n';
import AppWrapper from '@/hocs/AppWrappers';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import dynamic from 'next/dynamic';
import { LoadingDialog } from '@/components/loading/LoadingDialog';



const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FastE - Mua sắm thời trang & điện tử trực tuyến',
  description:
    'FastE cung cấp các sản phẩm thời trang, điện tử chất lượng với giá tốt và giao hàng nhanh chóng.',
  keywords: [
    'FastE',
    'thời trang',
    'điện tử',
    'mua sắm online',
    'shopping',
    'fast delivery',
  ],
  metadataBase: new URL('https://faste.vn'),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    title: 'FastE - Mua sắm thời trang & điện tử trực tuyến',
    description:
      'FastE cung cấp các sản phẩm thời trang, điện tử chất lượng với giá tốt và giao hàng nhanh chóng.',
    siteName: 'FastE',
    url: 'https://faste.vn',
    images: [
      {
        url: 'https://faste.vn/faste.png',
        width: 1200,
        height: 630,
        alt: 'FastE - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastE - Mua sắm thời trang & điện tử trực tuyến',
    description:
      'FastE cung cấp các sản phẩm thời trang, điện tử chất lượng với giá tốt và giao hàng nhanh chóng.',
    images: [
      {
        url: 'https://faste.vn/faste.png',
        width: 1200,
        height: 630,
        alt: 'FastE - Logo',
      },
    ],
  },
  // JSON-LD schema.org cho landing page
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

const i18nNamespaces = ['translation'];

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <Suspense fallback={<LoadingDialog isLoading />}>
          <TranslationProvider
            locale={locale}
            resources={resources}
            namespaces={i18nNamespaces}
          >
            <AppWrapper>{children}</AppWrapper>
          </TranslationProvider>
        </Suspense>
      </body>
    </html>
  );
}
