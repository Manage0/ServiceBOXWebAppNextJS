import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import { shipmentData } from '@/data/shipment-data';
import PageHeader from '@/app/shared/page-header';
import ExportButton from '@/app/shared/export-button';
import ImportButton from '@/app/shared/import-button';
import ProductImportBtn from '@/app/shared/product-import-btn';

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
      name: 'Új',
    },
  ],
};

interface HeaderProps {
  className?: string;
}

export default function PartnersPageHeader({ className }: HeaderProps) {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
  );
}
