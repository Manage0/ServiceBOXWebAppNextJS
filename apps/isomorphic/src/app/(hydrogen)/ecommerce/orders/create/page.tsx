import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CreateOrder from '@/app/shared/ecommerce/order/create-order';
import ImportButton from '@/app/shared/import-button';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Create Order'),
};

const pageHeader = {
  title: 'Order',
  breadcrumb: [
    {
      name: 'E-Commerce',
    },

    {
      name: 'Create',
    },
  ],
};

export default function CreateOrderPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ImportButton
          title="Upload Order"
          modalBtnLabel="Import Order"
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        />
      </PageHeader>
      <CreateOrder />
    </>
  );
}
