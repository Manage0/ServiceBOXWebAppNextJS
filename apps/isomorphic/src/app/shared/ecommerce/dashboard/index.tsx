import RecentOrder from '@/app/shared/ecommerce/dashboard/recent-order';

export default function EcommerceDashboard() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
        <RecentOrder className="relative @4xl:col-span-2 @7xl:col-span-12" />
        {/**TODO Ehh probably */}
      </div>
    </div>
  );
}
