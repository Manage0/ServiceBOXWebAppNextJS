'use client';

import { useEffect, useRef, useState } from 'react';
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
import { handleDate } from '@/utils';

async function fetchWorksheetData(id: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/worksheets/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  });

  const data: any = (await res.json()) as WorksheetFormTypes;
  if (!res.ok) {
    return null;
  }

  data.deadline_date = handleDate(data.deadline_date);
  data.completion_date = handleDate(data.completion_date);
  data.invoice_date = handleDate(data.invoice_date);
  data.handover_date = handleDate(data.handover_date);

  const partnerRes = await fetch(`${baseUrl}/api/partners/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: data.partner_id }),
    cache: 'no-store',
  });

  const dataPartner: PartnerFormTypes =
    (await partnerRes.json()) as PartnerFormTypes;

  data.partner_address = dataPartner.address;
  data.partner_city = dataPartner.city;
  data.partner_tax_num = dataPartner.tax_num;
  data.partner_postal_code = dataPartner.postal_code;
  data.partner_contact_person = dataPartner.contact_person;
  data.email = dataPartner.email;

  const sitesRes = await fetch(`${baseUrl}/api/sites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const dataSite: any[] = (await sitesRes.json()) as any[];

  let exactSite;
  dataSite.forEach((site) => {
    if (site.site_id == data.site_id) {
      exactSite = site;
    }
  });

  data.site = exactSite;

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

async function updateWorksheetSignature(
  id: string,
  signature: string,
  signingPerson: string,
  email: string,
  assignees: string[]
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/worksheets/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      signage: signature,
      signing_person: signingPerson,
      email,
    }),
  });

  if (!res.ok) {
    return false;
  }

  if (Array.isArray(assignees) && assignees.length > 0) {
    // Notify assignees
    const notifyRes = await fetch(`${baseUrl}/api/notify-assignees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userIds: assignees,
        worksheetId: id,
        newStatus: 'closed',
        changingPerson: 'blank as from public page',
      }),
    });
    return notifyRes.ok;
  }

  return true;
}

export default function InvoiceDetailsPage() {
  const pathname = usePathname();
  const invoiceId = pathname.split('/').pop();

  const [worksheetData, setWorksheetData] = useState<WorksheetFormTypes | null>(
    null
  );
  const sigCanvasRef = useRef<ReactSignatureCanvas | null>(null);

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

  const handleSign = async () => {
    if (!sigCanvasRef.current || !worksheetData) return;

    // Prevent signing if the worksheet's status is "closed"
    if (worksheetData.status === 'closed') {
      alert('A munkalap már lezárt állapotban van, nem írható alá.');
      return;
    }

    const signatureDataUrl = sigCanvasRef.current.toDataURL('image/png');
    if (!signatureDataUrl || sigCanvasRef.current.isEmpty()) {
      alert('Kérlek írd alá a munkalapot.');
      return;
    }

    const signingPerson = worksheetData.signing_person || ''; // Ensure signing_person is a string
    const email = worksheetData.email || ''; // Ensure email is a string
    const assignees = worksheetData.assignees || []; // Ensure assignees is an array

    const success = await updateWorksheetSignature(
      invoiceId!,
      signatureDataUrl,
      signingPerson,
      email,
      assignees
    );
    if (success) {
      alert('Munkalap sikeresen aláírva.');
    } else {
      alert('Hiba a munkalap aláírása közben.');
    }
  };

  if (!worksheetData) {
    return <div>Betöltés...</div>;
  }

  return (
    <>
      <Button
        onClick={handleSign}
        className="w-30 mx-auto my-5 flex items-center justify-center space-x-1.5 border-custom-green @lg:w-auto"
      >
        <Image
          src={'/SignWhite.svg'}
          alt="Sign"
          width={17}
          height={17}
          className="me-1.5"
        />
        Aláír
      </Button>
      <InvoiceDetails record={worksheetData} sigCanvasRef={sigCanvasRef} />
    </>
  );
}
