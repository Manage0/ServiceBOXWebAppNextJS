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

const invoiceItems = [
  {
    id: '1',
    product: {
      title: 'ChawkBazar Laravel Flutter Mobile App',
      description:
        'Along With Wordpress Themes & Plugins, We always try to use latest trending techs like React, Next Js, Gatsby Js, GraphQl, Shopify etc to make our products special.',
    },
    quantity: 2,
    unitPrice: 100,
    total: 200,
  },
  {
    id: '2',
    product: {
      title: 'Borobazar React Next Grocery Template',
      description:
        'Our rich tech choice will help you to build high performance applications. We are also known to provide great customer supports to our customers.',
    },
    quantity: 2,
    unitPrice: 100,
    total: 200,
  },
  {
    id: '3',
    product: {
      title: 'Superprops React Modern Landing Page Template',
      description:
        'Our rich tech choice will help you to build high performance applications. We are also known to provide great customer supports to our customers.',
    },
    quantity: 3,
    unitPrice: 100,
    total: 300,
  },
];

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: 'Tétel',
    dataIndex: 'product',
    key: 'product',
    width: 500,
    render: (product: any) => (
      <>
        <Title as="h6" className="mb-0.5 text-sm font-medium">
          {product.title}
        </Title>
        <Text
          as="p"
          className="max-w-[500px] overflow-hidden truncate text-sm text-gray-500"
        >
          {product.description}
        </Text>
      </>
    ),
  },

  {
    title: 'Mennyiség',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
  },
];

function InvoiceDetailsListTable() {
  return (
    <React.Fragment>
      <h2 className="mb-8 ml-16 text-left font-lexend text-[18px] font-bold tracking-normal text-[#333333] opacity-100">
        Felhasznált anyagok, szolgáltatások
      </h2>
      <Table
        data={invoiceItems}
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

function formatDate(date: Date | string): string {
  if (!date) return 'N/A'; // Handle missing dates
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

const InvoiceDetails: React.FC<{ record: any; sigCanvasRef: any }> = ({
  record,
  sigCanvasRef,
}) => {
  const pathname = usePathname();
  /*const savePDF = () => {
    const sigCanvas = sigCanvasRef.current;
    if (sigCanvas !== null && !sigCanvas.isEmpty()) {
      const signatureDataUrl = sigCanvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.text('Signature Section', 10, 10);
      pdf.addImage(signatureDataUrl, 'PNG', 10, 20, 180, 50); // Adjust position and size
      pdf.save('signature.pdf');
    } else {
      alert('Please add a signature before saving.');
    }
  };*/

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
            {record.site.name}
          </Text>
          <Text className="mb-1.5">{record.site.address}</Text>
          <Text className="mb-1.5">{record.site.city}</Text>
          <Text className="mb-1.5">{record.site.postal_code}</Text>
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
          {
            label: 'Eszköz neve',
            value: 'A256 Pénztárgép Epson TM-T810F nyomtatóval',
          },
          { label: 'Eszköz azonosító', value: 'AZ3600622' },
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
          { label: 'Indulás', value: record.start_time },
          { label: 'Érkezés', value: record.arrival_time },
          { label: 'Távozás', value: record.departure_time },
          { label: 'Visszaérkezés', value: record.rearrival_time },
        ]}
      />

      <InvoiceDetailsListTable />
      <div className="mb-8 mr-16 mt-6 pe-4 xs:mt-0">
        <Title
          as="h6"
          className="mb-1 text-xs font-semibold xs:mb-2 xs:text-sm"
        >
          Megjegyzés
        </Title>
        <Text className="ml-16 leading-[1.7]">{record.public_comment}</Text>
      </div>
      <div className="flex flex-col-reverse items-start justify-between border-t border-gray-300 pb-4 pt-8 xs:flex-row">
        {/* API

All API methods require a ref to the SignatureCanvas in order to use and are instance methods of the ref.

<SignatureCanvas ref={(ref) => { this.sigCanvas = ref }} />

    isEmpty() : boolean, self-explanatory
    clear() : void, clears the canvas using the backgroundColor prop
    fromDataURL(base64String, options) : void, writes a base64 image to canvas
    toDataURL(mimetype, encoderOptions): base64string, returns the signature image as a data URL
    fromData(pointGroupArray): void, draws signature image from an array of point groups
    toData(): pointGroupArray, returns signature image as an array of point groups
    off(): void, unbinds all event handlers
    on(): void, rebinds all event handlers
    getCanvas(): canvas, returns the underlying canvas ref. Allows you to modify the canvas however you want or call methods such as toDataURL()
    getTrimmedCanvas(): canvas, creates a copy of the canvas and returns a trimmed version of it, with all whitespace removed.
    getSignaturePad(): SignaturePad, returns the underlying SignaturePad reference.

The API methods are mostly just wrappers around signature_pad's API. on() and off() will, in addition, bind/unbind the window resize event handler. getCanvas(), getTrimmedCanvas(), and getSignaturePad() are new. */}
        {/* Signature Section */}
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
        {/**
        <div>
          <button
            onClick={savePDF}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save as PDF
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default InvoiceDetails;
