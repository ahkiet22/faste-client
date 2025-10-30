import { ReactNode } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import { ChatWidget } from '@/components/chat-widget';

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
