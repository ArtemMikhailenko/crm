import { notFound } from 'next/navigation';
import { CompanyDetailPage } from '@/views/companies/ui';

// Inline params type to avoid type mismatches with Next.js PageProps

// Mock data for company details
const getCompanyById = async (id: string) => {
  // В реальном приложении здесь будет запрос к API
  if (id === '1') {
    return {
      id: '45776890690',
      name: 'Biffco Enterprises Ltd.',
      editedDate: 'Nov 11',
      createdDate: '15/08/2017',
      registeredAddress: '76, Velyka Arnautska St., Odesa, Ukraine, 65045, office 2',
      requisites: 'IBAN: UA393287040000026002054312944 in JSC CB "PRIVATBANK"',
      documents: [
        { id: 1, name: 'Contract.png', isActive: true },
        { id: 2, name: 'Contract.png', isActive: false },
        { id: 3, name: 'Contract.png', isActive: false },
        { id: 4, name: 'Contract.png', isActive: false },
        { id: 5, name: 'Contract.png', isActive: false },
      ],
      projects: [
        {
          id: 8861,
          date: '16/08/2013',
          projectName: 'Binford Ltd.',
          manager: 'Flores, Juanita',
          status: 'Planning'
        },
        {
          id: 8829,
          date: '15/08/2017',
          projectName: 'Abstergo Ltd.',
          manager: 'Nguyen, Shane',
          status: 'Review'
        },
        {
          id: 1577,
          date: '15/08/2017',
          projectName: 'Acme Co.',
          manager: 'Nguyen, Shane',
          status: 'Process'
        },
        {
          id: 9151,
          date: '18/09/2016',
          projectName: 'Abstergo Ltd.',
          manager: 'Flores, Juanita',
          status: 'Process'
        },
        {
          id: 1374,
          date: '12/06/2020',
          projectName: 'Biffco Enterprises Ltd.',
          manager: 'Cooper, Kristin',
          status: 'Pause'
        }
      ],
      contacts: [
        {
          id: 1,
          name: 'Henry Arthur',
          phone: '(217) 555-0113',
          email: 'binhan628@gmail.com',
          avatar: '/avatars/henry-arthur.jpg',
          size: 'large' as const
        },
        {
          id: 2,
          name: 'Henry Arthur',
          phone: '(217) 555-0113',
          email: 'binhan628@gmail.com',
          avatar: '/avatars/henry-arthur-2.jpg',
          size: 'small' as const
        },
        {
          id: 3,
          name: 'Henry Arthur',
          phone: '(217) 555-0113',
          email: 'binhan628@gmail.com',
          avatar: '/avatars/henry-arthur-3.jpg',
          size: 'large' as const
        },
        {
          id: 4,
          name: 'Henry Arthur',
          phone: '(217) 555-0113',
          email: 'binhan628@gmail.com',
          avatar: '/avatars/henry-arthur-4.jpg',
          size: 'small' as const
        },
        {
          id: 5,
          name: 'Henry Arthur',
          phone: '(217) 555-0113',
          email: 'binhan628@gmail.com',
          avatar: '/avatars/henry-arthur-5.jpg',
          size: 'large' as const
        },
        {
          id: 6,
          name: 'Henry Arthur',
          phone: '(217) 555-0113',
          email: 'binhan628@gmail.com',
          avatar: '/avatars/henry-arthur-6.jpg',
          size: 'small' as const
        }
      ],
      fundsFlow: {
        debited: 7560,
        credited: 5420,
        weekData: [
          { day: 'Mon', debit: 30, credit: 70 },
          { day: 'Thu', debit: 60, credit: 40 },
          { day: 'Wed', debit: 45, credit: 55 },
          { day: 'Thu', debit: 30, credit: 70 },
          { day: 'Fri', debit: 80, credit: 20 },
          { day: 'Sat', debit: 30, credit: 70 },
          { day: 'Sun', debit: 60, credit: 40 }
        ]
      }
    };
  }
  return null;
};

export default async function CompanyDetailPageRoute(props: any) {
  const params = props?.params as { id: string };
  const company = await getCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return <CompanyDetailPage company={company} />;
}