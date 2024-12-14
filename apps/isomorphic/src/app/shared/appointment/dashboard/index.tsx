import UpcomingAppointmentTable from '@/app/shared/appointment/dashboard/upcoming-appointment-table';

export default function AppointmentDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6 @container @[59rem]:gap-7 3xl:gap-8">
      <UpcomingAppointmentTable className="col-span-full" />
      {/**TODO seems to be a good table to use */}
    </div>
  );
}
