'use client';

import { useState, useEffect, useRef } from 'react';
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
import ReactSignatureCanvas from 'react-signature-canvas';
import SignatureModal from './SignatureModal';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import SendModal from '../SendModal';

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

    // Fetch devices for the worksheet
    const devicesRes = await fetch(`${baseUrl}/api/devices/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ worksheet_id: id }),
      cache: 'no-store',
    });
    const devicesData = await devicesRes.json();
    if (devicesRes.ok) {
      data.devices = devicesData;
    }

    // Fetch products for the worksheet
    const productsRes = await fetch(`${baseUrl}/api/products/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ worksheet_id: id }),
      cache: 'no-store',
    });
    const productsData = await productsRes.json();
    if (productsRes.ok) {
      data.products = productsData;
    }

    return data;
  }

  // Define worksheetData state with type
  const [worksheetData, setWorksheetData] = useState<WorksheetFormTypes | null>(
    null
  );
  const sigCanvasRef = useRef<ReactSignatureCanvas | null>(null);

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

  async function updateWorksheetSignature(
    id: string,
    signature: string,
    signingPerson: string
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/worksheets/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        signage: signature,
        signage_date: new Date().toISOString(),
        signing_person: signingPerson,
      }),
    });

    return res.ok;
  }

  const handleSign = async (signature: string, signingPerson: string) => {
    const success = await updateWorksheetSignature(
      invoiceId!,
      signature,
      signingPerson
    );
    if (success) {
      toast.success('Munkalap sikeresen aláírva');
      window.location.reload();
    } else {
      toast.error('Hiba a munkalap aláírása közben');
    }
  };

  const { openModal } = useModal();

  if (!worksheetData) {
    return <div>Betöltés...</div>; // Or you can return a loading spinner or some placeholder content
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button
            onClick={() =>
              openModal({
                view: (
                  <SendModal
                    worksheetId={invoiceId || ''}
                    assignees={worksheetData.assignees}
                  />
                ),
              })
            }
            className="w-full border-custom-green bg-white text-custom-green hover:bg-custom-green hover:text-white @lg:w-auto"
          >
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
          {!worksheetData.signage && (
            <Button
              className="w-full border-custom-green @lg:w-auto"
              onClick={() =>
                openModal({
                  view: <SignatureModal onSave={handleSign} />,
                })
              }
            >
              <Image
                src={'/SignWhite.svg'}
                alt="Users icon"
                width={17}
                height={17}
                className="me-1.5"
              />
              Aláír
            </Button>
          )}
        </div>
      </PageHeader>

      <InvoiceDetails record={worksheetData} sigCanvasRef={sigCanvasRef} />
    </>
  );
}
