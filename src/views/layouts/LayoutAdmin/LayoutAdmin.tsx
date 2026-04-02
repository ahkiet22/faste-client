'use client';

import { ReactNode } from 'react';
import ListVerticalLayout from '../ListVerticalLayoutAdmin';

export default function LayoutAdmin({ children }: { children: ReactNode }) {
  return (
    <div>
      <ListVerticalLayout>
        <main className='w-full h-full'>{children}</main>
      </ListVerticalLayout>
    </div>
  );
}
