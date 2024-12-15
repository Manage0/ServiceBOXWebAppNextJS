import TicketsTable from '@/app/shared/support/dashboard/tickets';

export default function SupportDashboard() {
  return (
    <div className="@container">
      <div className="grid grid-cols-12 gap-6 3xl:gap-8">
        <TicketsTable className="col-span-full" />
      </div>
    </div>
  );
}
