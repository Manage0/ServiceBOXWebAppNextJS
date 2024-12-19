import { metaObject } from '@/config/site.config';
import PartnersPageHeader from './page-header';
import PartnersDashboard from '@/app/shared/partners/dashboard/PartnersDashboard';

export const metadata = {
  ...metaObject('Partners'),
};

export default function PartnersPage() {
  return (
    <>
      <PartnersPageHeader />
      <div className="flex flex-col gap-10">
        <PartnersDashboard />
      </div>
    </>
  );
}
