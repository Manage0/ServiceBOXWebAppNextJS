'use client';

import Image from 'next/image';
import { Badge, Title, Text } from 'rizzui';
import Table from '@core/components/legacy-table';
import { ReactBarcode } from 'react-jsbarcode';
import { usePathname } from 'next/navigation';
import InvoiceDates from './InvoiceDates';
import RepairDetails from './RepairDetails';
import React, { useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import WorksheetPrintFooter from './worksheet-print-footer';

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: 'Tétel',
    dataIndex: 'product_name',
    key: 'product_name',
    width: 500,
    render: (product_name: string, record: any) => (
      <>
        <Title as="h6" className="mb-0.5 text-sm font-medium">
          {product_name}
        </Title>
        <Text
          as="p"
          className="max-w-[500px] overflow-hidden truncate text-sm text-gray-500"
        >
          {record.public_comment || ''}
        </Text>
      </>
    ),
  },
  {
    title: 'Mennyiség',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
  },
];

function InvoiceDetailsListTable({ products }: { products: any[] }) {
  return (
    <React.Fragment>
      <h2 className="mb-8 ml-16 text-left font-lexend text-[18px] font-bold tracking-normal text-[#333333] opacity-100">
        Felhasznált anyagok, szolgáltatások
      </h2>
      <Table
        data={products}
        columns={columns}
        variant="minimal"
        rowKey={(record: any) => record.id}
        scroll={{ x: 660 }}
        className="mb-11"
      />
    </React.Fragment>
  );
}

interface InvoiceDetailsProps {
  record: WorksheetFormTypes | any; // Declare the record prop type
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Nincs adat'; // Handle missing dates
  const d = new Date(date); // Ensure it's a Date object
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function getFormattedNow(): string {
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date())
    .replace(',', ' -'); // Ensure correct format
}

const InvoiceDetails: React.FC<{
  record: any;
  sigCanvasRef: any;
  openSigantureModal?: () => void;
}> = ({ record, sigCanvasRef, openSigantureModal }) => {
  const pathname = usePathname();
  useEffect(() => {
    if (record.signage && sigCanvasRef.current) {
      // Load the signature into the canvas
      sigCanvasRef.current.fromDataURL(record.signage);

      // Disable drawing on the canvas
      sigCanvasRef.current.off();
    } else if (pathname.includes('worksheets')) {
      // Disable drawing on the canvas if opened from the internal system
      sigCanvasRef.current.off();
    }
  }, [record.signage, sigCanvasRef, pathname]);

  if (!record) {
    return <>Nincs elérhető adat</>;
  }

  return (
    <div className="w-full rounded-xl border border-muted p-5 text-sm sm:p-6 lg:p-8 2xl:p-10">
      <div>{/*JSON.stringify(record)*/}</div>
      <div className="mb-12 flex flex-col-reverse items-start justify-between md:mb-16 md:flex-row">
        <Image
          src={'/BBOXLogo.png'}
          alt={'BBOX logo'}
          className="dark:invert"
          width={120}
          height={40}
          priority
        />
        <div className="font-lexend-bold text-center text-3xl font-bold tracking-normal text-[#25282B] opacity-100">
          Munkalap
        </div>
        <div className="mb-4 md:mb-0">
          <Title as="h6">{record.worksheet_id}</Title>
          <Text className="mt-0.5 text-gray-500">Bizonylatszám</Text>
        </div>
      </div>

      <div className="mb-12 grid gap-4 xs:grid-cols-2 sm:grid-cols-4 sm:grid-rows-1">
        <div className="">
          <Title as="h6" className="mb-3.5 font-semibold">
            Kiállító
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            {record.company_name}
          </Text>
          <Text className="mb-1.5">{record.address}</Text>
          <Text className="mb-1.5">{record.city}</Text>
          <Text className="mb-1.5">{record.postal_code}</Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">{record.company_tax_num}</Text>
        </div>

        <div className="mt-4 xs:mt-0">
          <Title as="h6" className="mb-3.5 font-semibold">
            Partner
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            {record.partner_name}
          </Text>
          <Text className="mb-1.5">{record.partner_address}</Text>
          <Text className="mb-1.5">{record.partner_city}</Text>
          <Text className="mb-1.5">{record.partner_postal_code}</Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">{record.partner_tax_num}</Text>
        </div>

        <div className="mt-4 xs:mt-0">
          <Title as="h6" className="mb-3.5 font-semibold">
            Telephely
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            {record.site ? record.site.name : 'Nincs adat'}
          </Text>
          <Text className="mb-1.5">
            {record.site ? record.site.address : 'Nincs adat'}
          </Text>
          <Text className="mb-1.5">
            {record.site ? record.site.city : 'Nincs adat'}
          </Text>
          <Text className="mb-1.5">
            {record.site ? record.site.postal_code : 'Nincs adat'}
          </Text>
        </div>

        {/*<div className="mt-4 sm:mt-6 md:mt-0 md:justify-end">
          <ReactBarcode
            value="ABC123"
            options={{ format: 'code128', displayValue: false }}
          />
        </div>*/}
      </div>
      <InvoiceDates
        dates={[
          { label: 'Bizonylat kelte', value: formatDate(record.invoice_date) },
          {
            label: 'Vállalási határidő',
            value: formatDate(record.deadline_date),
          },
          { label: 'Elkészült', value: formatDate(record.completion_date) },
          { label: 'Átadva', value: formatDate(record.handover_date) },
        ]}
      />
      <RepairDetails
        title="Javítás"
        details={[
          ...(record.devices
            ? record.devices.flatMap((device: any) => [
                { label: 'Eszköz neve', value: device.name },
                { label: 'Eszköz azonosító', value: device.device_id },
              ])
            : []),
          { label: 'Munka megnevezése', value: record.work_description },
          { label: 'Szerelő', value: record.creator_name },
          { label: 'JIRA Ticket', value: record.jira_ticket_num },
          {
            label: 'Hiba / Munka leírása',
            value: record.issue_description,
          },
        ]}
      />

      <InvoiceDates
        dates={[
          { label: 'Indulás', value: record.start_time || 'Nincs adat' },
          { label: 'Érkezés', value: record.arrival_time || 'Nincs adat' },
          { label: 'Távozás', value: record.departure_time || 'Nincs adat' },
          {
            label: 'Visszaérkezés',
            value: record.rearrival_time || 'Nincs adat',
          },
        ]}
      />

      <InvoiceDetailsListTable products={record.products || []} />
      <div className="mb-8 mr-16 mt-6 pe-4 xs:mt-0">
        <Title
          as="h6"
          className="mb-1 text-xs font-semibold xs:mb-2 xs:text-sm"
        >
          Megjegyzés
        </Title>
        <Text className="ml-16 leading-[1.7]">
          {record.public_comment || ''}
        </Text>
      </div>
      <div className="flex flex-col-reverse items-start justify-between border-t border-gray-300 pb-4 pt-8 xs:flex-row">
        <div className="mr-20 flex w-full flex-col items-start">
          <div className="mb-4 flex h-32 w-full items-center justify-center bg-gray-100">
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 128,
                className: 'sigCanvas',
              }}
            />
          </div>
          <div className="flex w-full flex-row justify-between text-sm">
            <p className="text-gray-600">
              Aláírva:{' '}
              {record.signage ? getFormattedNow() : 'Még nincs aláírva'}
            </p>
            {record.signage && (
              <p className="text-gray-600">
                Aláíró neve:{' '}
                <span className="font-bold">
                  {record.signing_person || record.partner.contact_person}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      {window.location.pathname.includes('worksheets') && (
        <WorksheetPrintFooter
          openSignatureModal={openSigantureModal || undefined}
          isSigned={!!record.signage}
        />
      )}
    </div>
  );
};

export default InvoiceDetails;
