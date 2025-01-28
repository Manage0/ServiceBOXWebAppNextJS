import { metaObject } from '@/config/site.config';
import CompanyInfoView from '@/app/shared/account-settings/company-info';

export const metadata = {
  ...metaObject('Cégadatok'),
};

export default function ProfileSettingsFormPage() {
  return <CompanyInfoView />;
}
