import { metaObject } from '@/config/site.config';
import ProjectDashboard from '../shared/project-dashboard';

export const metadata = {
  ...metaObject(),
};

export default function DashboardPage() {
  return <ProjectDashboard />;
}
