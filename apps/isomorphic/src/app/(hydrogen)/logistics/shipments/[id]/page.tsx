import { PiPrinterBold, PiDownloadSimpleBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import Addresses from '@/app/shared/coworkers/shipment/details/addresses';
import InvoiceDetails from '@/app/shared/coworkers/shipment/details/invoice-details';
import TrackingHistory from '@/app/shared/coworkers/shipment/details/tracking-history';
import ShippingDetails from '@/app/shared/coworkers/shipment/details/shipping-details';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Shipment Details'),
};

const pageHeader = {
  title: 'Shipment Details',
  breadcrumb: [
    {
      name: 'Dashboard',
    },
    {
      name: 'Shipments',
    },
    {
      name: 'Shipment Details',
    },
  ],
};

export default function LogisticsListPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-6 flex items-center gap-4 @2xl:mt-0">
          <Button className="w-full gap-2 @lg:w-auto" variant="outline">
            <PiPrinterBold className="h-4 w-4" />
            Print
          </Button>
          <Button className="w-full gap-2 @lg:w-auto">
            <PiDownloadSimpleBold className="h-4 w-4" />
            Download
          </Button>
        </div>
      </PageHeader>

      <div className="mt-2 flex flex-col gap-y-6 @container sm:gap-y-10">
        <InvoiceDetails />
        <TrackingHistory />
        <ShippingDetails />
        <Addresses />
      </div>
    </>
  );
}
