import dayjs from 'dayjs';
import ShipmentTableWidget from '@/app/shared/logistics/dashboard/shipment-table';
import InvoiceTable from '../../invoice/invoice-list/table';
import CoworkersTable from '../../invoice/invoice-list/coworkersTable';

const thisMonth = dayjs(new Date()).format('MMMM YYYY');

export default function LogisticsDashboard() {
  return (
    <div className="@container">
      <CoworkersTable searchbarPlaceholder="Keresés..." />
    </div>
  );
}
