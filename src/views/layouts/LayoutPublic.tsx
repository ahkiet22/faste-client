
import { ReactNode } from 'react';
import { ChatWidget } from '@/components/chat-widget';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import Header from './components/header';

const Footer = dynamic(() => import('./components/footer'), {
  loading: () => <LoadingSpinner />,
});

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {/* <div>Header</div> */}
      <main className="bg-[#F5F5F5] dark:bg-[#121212] py-8">
        <ChatWidget />
        {children}
      </main>
      <Footer />
    </div>
  );
}
