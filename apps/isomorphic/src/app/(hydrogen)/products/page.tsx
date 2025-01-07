import { metaObject } from '@/config/site.config';
import ProductsDashboard from '@/app/shared/products/dashboard/ProductsDashboard';
import PageHeader from '@/app/shared/page-header';

export const metadata = {
  ...metaObject('Termékek'),
};

const pageHeader = {
  title: 'Termékek',
  breadcrumb: [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Termékek',
      href: '/products',
    },
    {
      name: 'Lista',
    },
  ],
};

export default function LogisticsPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div className="flex flex-col gap-10">
        <ProductsDashboard />
      </div>
    </>
  );
}
