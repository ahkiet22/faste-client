"use client";

import ExampleClientComponent from '@/components/ExampleClientComponent';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <main>
      <h1>{t('getStarted')}</h1>
      <ExampleClientComponent />
    </main>
  );
}
