import dayjs from 'dayjs';
import CoworkersTable from '../../invoice/invoice-list/coworkersTable';

const thisMonth = dayjs(new Date()).format('MMMM YYYY');

export default function CoworkersDashboard() {
  return (
    <div className="@container">
      <CoworkersTable searchbarPlaceholder="Keresés..." />
    </div>
  );
}
