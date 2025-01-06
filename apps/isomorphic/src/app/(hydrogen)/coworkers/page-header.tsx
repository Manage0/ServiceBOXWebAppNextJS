'use client';

import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import ImportButton from '@/app/shared/import-button';
import { useModal } from '@/app/shared/modal-views/use-modal';
import AddTeamMemberModalView from '@/app/shared/account-settings/modal/add-team-member';

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

export default function CoworkersPageHeader() {
  const { openModal } = useModal();
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <div className="mt-4 flex flex-col items-center gap-3 @sm:flex-row @lg:mt-0">
        <ImportButton
          title="Upload File"
          className="me-[10px] mt-4 border-0 border-[1px] border-[#E3E3E3] bg-white text-[#484848] hover:border-[#E3E3E3] hover:bg-gray-100 hover:text-[#484848] @lg:mt-0"
        />
        <Button
          as="span"
          className="w-full @lg:w-auto"
          onClick={() =>
            openModal({
              view: <AddTeamMemberModalView />,
            })
          }
        >
          <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
          Új munkatárs
        </Button>
      </div>
    </PageHeader>
  );
}
