import { metaObject } from '@/config/site.config';
import AppointmentListPageHeader from './page-header';
import AppointmentListTable from '@/app/shared/appointment/appointment-list/list';

export const metadata = {
  ...metaObject('Appointment List'),
};

export default function AppointmentListPage() {
  return (
    <>
      <AppointmentListPageHeader />
      <div className="space-y-10 @container">
        <AppointmentListTable />
      </div>
    </>
  );
}
