import ShipmentListTable from '@/app/shared/coworkers/shipment/list/table';
import ShipmentPageHeader from '@/app/(hydrogen)/logistics/shipments/page-header';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Shipments'),
};

export default function LogisticsListPage() {
  return (
    <>
      <ShipmentPageHeader />
      <div className="flex flex-col gap-10">
        <ShipmentListTable />
      </div>
    </>
  );
}
