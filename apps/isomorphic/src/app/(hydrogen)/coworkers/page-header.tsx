'use client';

import PageHeader from '@/app/shared/page-header';
import AddTeamMemberModalView from '@/app/shared/account-settings/modal/add-team-member';
import AddBtn from '@/app/shared/add-btn';

const pageHeader = {
  title: 'Munkatársak',
  breadcrumb: [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Munkatársak',
      href: '/coworkers',
    },
    {
      name: 'Lista',
    },
  ],
};

interface CoworkersPageHeaderProps {
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

export default function CoworkersPageHeader({
  setLoading,
  isLoading,
}: CoworkersPageHeaderProps) {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <AddBtn
        modalView={
          <AddTeamMemberModalView
            isLoading={isLoading}
            setLoading={setLoading}
          />
        }
        text="Új munkatárs"
        className="mt-4"
      />
    </PageHeader>
  );
}
