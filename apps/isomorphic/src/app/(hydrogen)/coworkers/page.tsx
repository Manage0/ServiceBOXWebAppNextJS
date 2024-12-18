import CoworkersDashboard from '@/app/shared/coworkers/dashboard';
import { metaObject } from '@/config/site.config';
import CoworkersPageHeader from './page-header';

export const metadata = {
  ...metaObject('Coworkers'),
};

export default function LogisticsPage() {
  return (
    <>
      <CoworkersPageHeader />
      <div className="flex flex-col gap-10">
        <CoworkersDashboard />
      </div>
    </>
  );
}
