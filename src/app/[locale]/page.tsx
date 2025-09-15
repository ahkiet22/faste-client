'use client';

import ExampleClientComponent from '@/components/ExampleClientComponent';
import LayoutPublic from '@/views/layouts/LayoutSeller';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <LayoutPublic>
      <div className="container mx-auto max-w-6xl px-4">
        <h1>{t('getStarted')}</h1>
        <ExampleClientComponent />
      </div>
    </LayoutPublic>
  );
}
