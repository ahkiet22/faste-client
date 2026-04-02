'use client';

import { ReactNode } from 'react';
import ListVerticalLayout from '../ListVerticalLayout';

export default function LayoutSeller({ children }: { children: ReactNode }) {
  return (
    <div>
      <ListVerticalLayout>
        <main className='w-full h-full'>{children}</main>
      </ListVerticalLayout>
    </div>
  );
}
