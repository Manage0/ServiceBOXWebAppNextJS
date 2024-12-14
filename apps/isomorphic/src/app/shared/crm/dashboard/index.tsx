import { Box } from 'rizzui';
import TeamActivity from './team-activity';

export default function CrmDashboard() {
  return (
    <Box className="@container/crm">
      <Box className="grid grid-cols-1 gap-6 @3xl/crm:grid-cols-12 @7xl/crm:gap-7 3xl:gap-8">
        <TeamActivity className="@3xl/crm:col-span-6 @7xl/crm:col-span-4 dark:bg-[#181818]" />
        {/**TODO this will be the half-circle chart */}
      </Box>
    </Box>
  );
}
