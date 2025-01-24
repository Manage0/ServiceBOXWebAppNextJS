import { metaObject } from '@/config/site.config';
import PersonalInfoView from '@/app/shared/account-settings/personal-info';

export const metadata = {
  ...metaObject('Adataim'),
};

export default function ProfileSettingsFormPage() {
  return <PersonalInfoView />;
}
