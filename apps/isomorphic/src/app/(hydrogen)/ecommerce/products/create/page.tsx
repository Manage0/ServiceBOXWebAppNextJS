import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Create Product'),
};

export default function CreateProductPage() {
  return (
    <>
      <CreateEditProduct />
    </>
  );
}
