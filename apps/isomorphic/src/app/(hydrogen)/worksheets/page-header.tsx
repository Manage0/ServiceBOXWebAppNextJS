'use client';

import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import AddBtn from '@/app/shared/add-btn';

const pageHeader = {
  title: 'Munkalap',
  breadcrumb: [
    {
      name: 'Home',
    },
    {
      name: 'Munkalap',
    },
    {
      name: 'Lista',
    },
  ],
};

export default function WorksheetPageHeader() {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <AddBtn href={routes.worksheets.create} text="Új munkalap" />
    </PageHeader>
  );
}
