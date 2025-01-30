'use client';

import { PiDownloadSimpleBold } from 'react-icons/pi';
import InvoiceDetails from '@/app/shared/invoice/invoice-details';
import PrintButton from '@/app/shared/print-button';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';
import { usePathname } from 'next/navigation';
import DownloadBtn from '@/app/shared/download-btn';
import Image from 'next/image';

export default function InvoiceDetailsPage() {
  const pathname = usePathname();
  const invoiceId = pathname.split('/').pop(); // Extract the last part of the pathname
  const pageHeader = {
    title: 'Részletek',
    breadcrumb: [
      {
        name: 'Home',
      },
      {
        name: 'Munkalap',
      },
      {
        name: invoiceId ? invoiceId : 'Részletek',
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button className="w-full border-custom-green bg-white text-custom-green hover:bg-custom-green hover:text-white @lg:w-auto">
            <Image
              src={'/Send.svg'}
              alt="Users icon"
              width={17}
              height={17}
              className="me-1.5"
            />
            Elküldve
          </Button>
          <DownloadBtn
            onExport={() => {
              alert('Letöltés');
            }}
            size="md"
          />
          <Button className="w-full border-custom-green @lg:w-auto">
            <Image
              src={'/SignWhite.svg'}
              alt="Users icon"
              width={17}
              height={17}
              className="me-1.5"
            />
            Aláír
          </Button>
        </div>
      </PageHeader>

      <InvoiceDetails />
    </>
  );
}
