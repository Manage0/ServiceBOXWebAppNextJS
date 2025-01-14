'use client';

import PageHeader from '@/app/shared/page-header';
import ImportButton from '@/app/shared/import-button';
import AddBtn from '@/app/shared/add-btn';
import { routes } from '@/config/routes';

const pageHeader = {
  title: 'Partnerek',
  breadcrumb: [
    {
      name: 'Home',
    },
    {
      name: 'Partnerek',
    },
    {
      name: 'Lista',
    },
  ],
};

interface HeaderProps {
  className?: string;
}

export default function PartnersPageHeader({ className }: HeaderProps) {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <div className="mt-4 flex flex-col items-center gap-3 @sm:flex-row @lg:mt-0">
        <ImportButton
          title="Upload File"
          className="me-[10px] mt-4 border-0 border-[1px] border-[#E3E3E3] bg-white text-[#484848] hover:border-[#E3E3E3] hover:bg-gray-100 hover:text-[#484848] @lg:mt-0"
        />
        <AddBtn href={routes.partners.add} text="Új partner" />
      </div>
    </PageHeader>
  );
}
