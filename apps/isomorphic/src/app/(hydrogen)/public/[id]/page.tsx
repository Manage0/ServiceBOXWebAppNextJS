'use client';

import { useEffect, useState } from 'react';
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
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import { PartnerFormTypes } from '@/validators/partner.schema';

// Fetch the worksheet data just like in the InvoiceEditPage
async function fetchWorksheetData(id: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/worksheets/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store', // Ensures fresh data is always fetched
  });

  const data: any = (await res.json()) as WorksheetFormTypes;
  if (!res.ok) {
    return null;
  }

  // Convert dates
  data.deadline_date = new Date(data.deadline_date);
  data.completion_date = new Date(data.completion_date);
  data.invoice_date = new Date(data.invoice_date);
  data.handover_date = new Date(data.handover_date);

  const partnerRes = await fetch(`${baseUrl}/api/partners/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: data.partner_id }),
    cache: 'no-store', // Ensures fresh data is always fetched
  });

  const dataPartner: PartnerFormTypes =
    (await partnerRes.json()) as PartnerFormTypes;

  data.partner_address = dataPartner.address;
  data.partner_city = dataPartner.city;
  data.partner_tax_num = dataPartner.tax_num;
  data.partner_postal_code = dataPartner.postal_code;
  data.partner_contact_person = dataPartner.contact_person;

  const sitesRes = await fetch(`${baseUrl}/api/sites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Ensures fresh data is always fetched
  });

  const dataSite: any[] = (await sitesRes.json()) as any[];

  let exactSite;
  dataSite.forEach((site) => {
    if (site.site_id == data.site_id) {
      exactSite = site;
    }
  });

  data.site = exactSite;

  return data;
}

export default function InvoiceDetailsPage() {
  const pathname = usePathname();
  const invoiceId = pathname.split('/').pop(); // Extract the last part of the pathname

  // Define worksheetData state with type
  const [worksheetData, setWorksheetData] = useState<WorksheetFormTypes | null>(
    null
  );

  // Fetch worksheet data when the component mounts
  useEffect(() => {
    if (invoiceId) {
      fetchWorksheetData(invoiceId).then((data) => {
        if (data) {
          setWorksheetData(data);
        } else {
          // Handle error case (e.g., redirect to a 404 page or show an error)
        }
      });
    }
  }, [invoiceId]);

  if (!worksheetData) {
    return <div>Loading...</div>; // Or you can return a loading spinner or some placeholder content
  }

  return (
    <>
      <Button className="w-30 mx-auto my-5 flex items-center justify-center space-x-1.5 border-custom-green @lg:w-auto">
        <Image
          src={'/SignWhite.svg'}
          alt="Users icon"
          width={17}
          height={17}
          className="me-1.5"
        />
        Aláír
      </Button>
      <InvoiceDetails record={worksheetData} />
    </>
  );
}
