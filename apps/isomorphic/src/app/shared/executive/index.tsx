import cn from '@core/utils/class-names';
import StatsCards from '@/app/shared/executive/stats-cards';
import RecentCustomers from '@/app/shared/executive/recent-customers';

export default function ExecutiveDashboard({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 @container 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8',
        className
      )}
    >
      <StatsCards />
      <RecentCustomers />
    </div>
  );
}
