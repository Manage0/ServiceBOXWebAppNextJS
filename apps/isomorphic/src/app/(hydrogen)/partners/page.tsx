import { metaObject } from '@/config/site.config';
import PartnersPageHeader from './page-header';
import PartnersDashboard from '@/app/shared/partners/dashboard/PartnersDashboard';

export const metadata = {
  ...metaObject('Partnerek'),
};

export default function PartnersPage() {
  return (
    <>
      <PartnersPageHeader name="Lista" />
      <div className="flex flex-col gap-10">
        <PartnersDashboard />
      </div>
    </>
  );
}
