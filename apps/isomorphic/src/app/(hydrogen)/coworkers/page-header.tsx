import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import { shipmentData } from '@/data/shipment-data';
import PageHeader from '@/app/shared/page-header';
import ExportButton from '@/app/shared/export-button';
import ImportButton from '@/app/shared/import-button';

const pageHeader = {
  title: 'Munkatársak',
  breadcrumb: [
    {
      name: 'Home',
    },
    {
      name: 'Munkatársak',
    },
    {
      name: 'Lista',
    },
  ],
};

interface HeaderProps {
  className?: string;
}

export default function CoworkersPageHeader({ className }: HeaderProps) {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <div className="mt-4 flex flex-col items-center gap-3 @sm:flex-row @lg:mt-0">
        <ImportButton
          title="Upload File"
          className="me-[10px] mt-4 border-0 border-[1px] border-[#E3E3E3] bg-white text-[#484848] hover:border-[#E3E3E3] hover:bg-gray-100 hover:text-[#484848] @lg:mt-0"
        />
        <Link
          href={routes.logistics.createShipment}
          className="w-full @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Új munkatárs
          </Button>
        </Link>
      </div>
    </PageHeader>
  );
}
