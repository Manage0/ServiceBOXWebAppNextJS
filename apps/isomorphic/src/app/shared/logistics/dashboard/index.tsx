import dayjs from 'dayjs';
import TopCustomer from '@/app/shared/logistics/dashboard/top-customer';
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
        <TopCustomer className="col-span-full @3xl:col-span-full @5xl:col-span-full @7xl:col-span-8" />

        <ShipmentTableWidget
          title="Recent Shipments"
          description={`Summary of recent shipments of ${thisMonth}`}
          className="col-span-full"
        />
      </div>
    </div>
  );
}
