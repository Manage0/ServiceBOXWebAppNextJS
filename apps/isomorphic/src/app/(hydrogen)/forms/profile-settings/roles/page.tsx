import { metaObject } from '@/config/site.config';
import PersonalInfoView from '@/app/shared/account-settings/personal-info';
import CompanyInfoView from '@/app/shared/account-settings/company-info';
import RolesView from '@/app/shared/account-settings/roles';

export const metadata = {
  ...metaObject('Szerepkörök'),
};

export default function ProfileSettingsFormPage() {
  return <RolesView />;
}
