import { TabList } from '@/app/shared/support/inbox/inbox-tabs';
import SupportInbox from '@/app/shared/support/inbox';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Support Inbox'),
};

export default function SupportInboxPage() {
  return (
    <>
      <TabList />

      <SupportInbox />
    </>
  );
}
