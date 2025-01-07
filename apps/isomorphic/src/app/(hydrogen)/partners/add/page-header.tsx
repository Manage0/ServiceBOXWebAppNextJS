import PageHeader from '@/app/shared/page-header';

const pageHeader = {
  title: 'Partnerek',
  breadcrumb: [
    {
      name: 'Home',
    },
    {
      name: 'Partnerek',
    },
    {
      name: 'Új',
    },
  ],
};

interface HeaderProps {
  className?: string;
}

export default function PartnersPageHeader({ className }: HeaderProps) {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
  );
}
