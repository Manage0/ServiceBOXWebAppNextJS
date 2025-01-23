import { metaObject } from '@/config/site.config';
import AddPartnerView from '@/app/shared/partners/AddPartnerView';
import PartnersPageHeader from '../page-header';

export const metadata = {
  ...metaObject('Partner hozzáadása'),
};

export default function PartnersPage() {
  return (
    <>
      <PartnersPageHeader name="Új" />
      <AddPartnerView />
    </>
  );
}
