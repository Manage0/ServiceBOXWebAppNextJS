import CoworkersDashboard from '@/app/shared/coworkers/dashboard';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Munkatársak'),
};

export default function CoworkersPage() {
  return <CoworkersDashboard />;
}
