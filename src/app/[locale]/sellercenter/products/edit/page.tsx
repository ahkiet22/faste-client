import TemplateListPage from '@/views/pages/sellercenter/seller-store/template';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading template...</div>}>
      <TemplateListPage />
    </Suspense>
  );
}
