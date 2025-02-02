'use client';

import PageHeader from '@/app/shared/page-header';
import { useModal } from '@/app/shared/modal-views/use-modal';
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
  const { openModal } = useModal();
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <div className="mt-4 flex flex-col items-center gap-3 @sm:flex-row @lg:mt-0">
        <AddBtn
          onClick={() =>
            openModal({
              view: (
                <AddTeamMemberModalView
                  isLoading={isLoading}
                  setLoading={setLoading}
                />
              ),
            })
          }
          text="Új munkatárs"
        />
      </div>
    </PageHeader>
  );
}
