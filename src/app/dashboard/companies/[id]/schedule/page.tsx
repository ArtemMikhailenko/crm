import { CompanySchedulesPage } from '@/views/companies/ui/company-schedules-page';

export default function CompanySchedulesRoute(props: any) {
  const params = props?.params as { id: string };
  return <CompanySchedulesPage companyId={params.id} />;
}
