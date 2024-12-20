import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CreateWorksheet from '@/app/shared/worksheets/create-worksheet';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Új munkalap'),
};

const pageHeader = {
  title: 'Új munkalap',
  breadcrumb: [
    {
      name: 'Home',
    },
    {
      href: routes.invoice.home,
      name: 'Munkalap',
    },
    {
      name: 'Új',
    },
  ],
};

export default function InvoiceCreatePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <CreateWorksheet />
    </>
  );
}
