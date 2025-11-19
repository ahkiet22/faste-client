import { TemplateWidgetDetailPage } from '@/views/pages/sellercenter/seller-store/template/[templateId]/page';
import { notFound } from 'next/navigation';

// server component
interface PageProps {
  params: Promise<{ templateId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { templateId } = await params;

  if (!templateId) {
    return notFound();
  }

  return <TemplateWidgetDetailPage templateId={Number(templateId)} />;
}
