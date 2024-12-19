import { metaObject } from '@/config/site.config';
import ProductsPageHeader from './page-header';
import ProductsDashboard from '@/app/shared/products/dashboard/ProductsDashboard';

export const metadata = {
  ...metaObject('Coworkers'),
};

export default function LogisticsPage() {
  return (
    <>
      <ProductsPageHeader />
      <div className="flex flex-col gap-10">
        <ProductsDashboard />
      </div>
    </>
  );
}
