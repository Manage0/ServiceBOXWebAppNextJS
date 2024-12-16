import dayjs from 'dayjs';
import ShipmentTableWidget from '@/app/shared/logistics/dashboard/shipment-table';

const thisMonth = dayjs(new Date()).format('MMMM YYYY');

export default function LogisticsDashboard() {
  return (
    <div className="@container">
      <div className="grid grid-cols-12 gap-6 3xl:gap-8">
        <ShipmentTableWidget
          title="Pending Shipments"
          description={`Summary of pending shipments of ${thisMonth}`}
          className="col-span-full"
        />
      </div>
    </div>
  );
}
