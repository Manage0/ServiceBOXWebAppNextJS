'use client';

import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import ExportButton from '@/app/shared/export-button';
import { appointmentData } from '@/data/appointment-data';
import { useModal } from '@/app/shared/modal-views/use-modal';
import CreateUpdateAppointmentForm from '@/app/shared/appointment/appointment-list/appointment-form';
import NewWorksheetBtn from '../partners/NewWorksheetBtn';

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

interface HeaderProps {
  className?: string;
}

export default function WorksheetPageHeader({ className }: HeaderProps) {
  const { closeModal, openModal } = useModal();
  function handleCreateModal() {
    closeModal(),
      openModal({
        view: <CreateUpdateAppointmentForm />,
        customSize: '700px',
      });
  }
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <NewWorksheetBtn />
    </PageHeader>
  );
}
