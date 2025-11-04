import { CompanyDetailPage } from '@/views/companies/ui';

export default async function CompanyDetailPageRoute(props: any) {
  const params = await props?.params as { id: string };
  
  return <CompanyDetailPage companyId={params.id} />;
}