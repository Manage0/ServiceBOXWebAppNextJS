import { metaObject } from '@/config/site.config';
import AppointmentListPageHeader from './page-header';
import AppointmentListTable from '@/app/shared/appointment/appointment-list/list';
import TableLayout from '../../tables/table-layout';
import { invoiceData } from '@/data/invoice-data';
import InvoiceTable from '@/app/shared/invoice/invoice-list/table';

export const metadata = {
  ...metaObject('Worksheet List'),
};

export default function AppointmentListPage() {
  return (
    <>
      <AppointmentListPageHeader />
      <div className="space-y-10 @container">
        <TableLayout
          title={undefined}
          breadcrumb={[]}
          data={invoiceData}
          fileName={undefined}
          header={undefined}
        >
          <InvoiceTable
            searchbarPlaceholder={'Keresés a munkalapok között...'}
          />
        </TableLayout>
      </div>
    </>
  );
}
