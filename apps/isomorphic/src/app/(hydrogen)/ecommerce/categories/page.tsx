import CategoryTable from '@/app/shared/ecommerce/category/category-list/table';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Categories'),
};

export default function CategoriesPage() {
  return (
    <>
      <CategoryTable />
    </>
  );
}
