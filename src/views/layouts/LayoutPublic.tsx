"use client"

import { ReactNode } from 'react';
import Header from './components/header';
import { ChatWidget } from '@/components/chat-widget';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./components/footer'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main className="bg-[#F5F5F5] dark:bg-[#121212] py-8">
        <ChatWidget />
        {children}
      </main>
      <Footer />
    </div>
  );
}
