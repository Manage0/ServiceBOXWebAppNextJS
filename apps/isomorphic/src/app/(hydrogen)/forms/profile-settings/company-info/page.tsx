import { metaObject } from '@/config/site.config';
import PersonalInfoView from '@/app/shared/account-settings/personal-info';
import CompanyInfoView from '@/app/shared/account-settings/company-info';

export const metadata = {
  ...metaObject('Cégadatok'),
};

export default function ProfileSettingsFormPage() {
  return <CompanyInfoView />;
}
