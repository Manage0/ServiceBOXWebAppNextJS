import { Box } from 'rizzui';
import ProjectActivities from './activities';
import OverallProgress from './overall-progress';
import DashboardHeader from './dashboardHeader';
import TableLayout from '@/app/(hydrogen)/tables/table-layout';
import InvoiceTable from '../invoice/invoice-list/table';
import { invoiceData } from '@/data/invoice-data';

export default function ProjectDashboard() {
  return (
    <Box className="@container/pd">
      <DashboardHeader className="mb-6 3xl:mb-8" />
      <TableLayout
        title={'Nyitott munkalapok'}
        breadcrumb={[]}
        data={invoiceData}
        fileName={undefined}
        header={undefined}
      >
        <InvoiceTable searchbarPlaceholder={'Keresés a munkalapok között...'} />
      </TableLayout>
      {/*<Box className="grid grid-flow-row grid-cols-1 gap-6 @3xl/pd:grid-cols-12 3xl:gap-8">
        <OverallProgress className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <ProjectActivities className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
      </Box>*/}
    </Box>
  );
}
