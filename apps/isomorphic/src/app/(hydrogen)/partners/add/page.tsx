import { metaObject } from '@/config/site.config';
import PartnersPageHeader from './page-header';
import AddPartnerView from '@/app/shared/partners/AddPartnerView';

export const metadata = {
  ...metaObject('Partner hozzáadása'),
};

export default function PartnersPage() {
  return (
    <>
      <PartnersPageHeader />
      <AddPartnerView />
    </>
  );
}
