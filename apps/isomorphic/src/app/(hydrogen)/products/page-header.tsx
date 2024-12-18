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
  title: 'Termékek',
  breadcrumb: [
    {
      name: 'Home',
    },
    {
      name: 'Termékek',
    },
    {
      name: 'Lista',
    },
  ],
};

interface HeaderProps {
  className?: string;
}

export default function ProductsPageHeader({ className }: HeaderProps) {
  return (
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
      <div className="mt-4 flex flex-col items-center gap-3 @sm:flex-row @lg:mt-0">
        <ProductImportBtn
          buttonLabel="Terméklista frissítés"
          title="Upload File"
          className="me-[10px] mt-4 border-0 border-[1px] border-[#E3E3E3] bg-white text-[#484848] hover:border-[#E3E3E3] hover:bg-gray-100 hover:text-[#484848] @lg:mt-0"
        />
      </div>
    </PageHeader>
  );
}
