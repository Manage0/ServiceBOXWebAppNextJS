import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import CreateWorksheet from '@/app/shared/worksheets/create-worksheet';
import { routes } from '@/config/routes';
import { notFound } from 'next/navigation';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

export const metadata = {
  ...metaObject('Munkalap szerkesztése'),
};

async function fetchWorksheetData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Ensure this is set in your environment variables
  const res = await fetch(`${baseUrl}/api/worksheets/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store', // Ensures fresh data is always fetched
  });
  const data = (await res.json()) as { [key: string]: any };
  if (!res.ok) {
    return null;
  }

  data.deadline_date = new Date(data.deadline_date);
  data.completion_date = new Date(data.completion_date);
  data.invoice_date = new Date(data.invoice_date);
  data.handover_date = new Date(data.handover_date);

  return data;
}

export default async function InvoiceEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const worksheetData: WorksheetFormTypes = (await fetchWorksheetData(
    id
  )) as WorksheetFormTypes;

  if (!worksheetData) {
    notFound();
  }

  const pageHeader = {
    title: 'Munkalap szerkesztése',
    breadcrumb: [
      { name: 'Home' },
      { href: routes.invoice.home, name: 'Munkalap' },
      { name: 'Szerkesztés' },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateWorksheet id={id} record={worksheetData} />
    </>
  );
}
