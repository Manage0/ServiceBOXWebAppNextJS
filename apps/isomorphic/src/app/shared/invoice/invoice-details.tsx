'use client';

import Image from 'next/image';
import { Badge, Title, Text } from 'rizzui';
import Table from '@core/components/legacy-table';
import { ReactBarcode } from 'react-jsbarcode';
import { usePathname } from 'next/navigation';
import InvoiceDates from './InvoiceDates';
import RepairDetails from './RepairDetails';
import React from 'react';

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
  {
    title: 'Egységár',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 100,
    render: (value: string) => <Text className="font-medium">${value}</Text>,
  },
  {
    title: 'Összesen',
    dataIndex: 'total',
    key: 'total',
    width: 150,
    render: (value: string) => <Text className="font-medium">${value}</Text>,
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

export default function InvoiceDetails() {
  const pathname = usePathname();
  return (
    <div className="w-full rounded-xl border border-muted p-5 text-sm sm:p-6 lg:p-8 2xl:p-10">
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
          <Title as="h6">{pathname.split('/').pop()}</Title>
          <Text className="mt-0.5 text-gray-500">Bizonylatszám</Text>
        </div>
      </div>

      <div className="mb-12 grid gap-4 xs:grid-cols-2 sm:grid-cols-4 sm:grid-rows-1">
        <div className="">
          <Title as="h6" className="mb-3.5 font-semibold">
            Kiállító
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            BBOX Solutions Kft.
          </Text>
          <Text className="mb-1.5">Gyár u. 2</Text>
          <Text className="mb-1.5">Budaörs</Text>
          <Text className="mb-1.5">2024</Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">HU24227436</Text>
        </div>

        <div className="mt-4 xs:mt-0">
          <Title as="h6" className="mb-3.5 font-semibold">
            Partner
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            Paprikasoft Kft.
          </Text>
          <Text className="mb-1.5">Aradi vértanúk útja 36.</Text>
          <Text className="mb-1.5">Siófok</Text>
          <Text className="mb-1.5">8600</Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">HU16726478</Text>
        </div>

        <div className="mt-4 xs:mt-0">
          <Title as="h6" className="mb-3.5 font-semibold">
            Telephely
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            Paprikasoft Siófok
          </Text>
          <Text className="mb-1.5">Bajcsy-Zsilinszky u. 212.</Text>
          <Text className="mb-1.5">Siófok</Text>
          <Text className="mb-1.5">8600</Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">HU16726478</Text>
        </div>

        <div className="mt-4 sm:mt-6 md:mt-0 md:justify-end">
          <ReactBarcode
            value="ABC123"
            options={{ format: 'code128', displayValue: false }}
          />
        </div>
      </div>
      <InvoiceDates
        dates={[
          { label: 'Bizonylat kelte', value: '2024.10.02.' },
          { label: 'Vállalási határidő', value: '2024.10.02.' },
          { label: 'Elkészült', value: '2024.10.02.' },
          { label: 'Átadva', value: '2024.10.02.' },
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
          { label: 'Munka megnevezése', value: '#02 Kassza cseréje' },
          { label: 'Szerelő', value: 'Szabó Attila' },
          { label: 'JIRA Ticket', value: 'INC-94' },
          {
            label: 'Hiba / Munka leírása',
            value:
              "HRS és Levi's kérése: #2 kassza cseréje utáni helyszíni ügyelet\n\nElvégzett munka leírása: Az előző napon a #2 kasszát cseréltük, másnapra kértek helyszíni felügyeletet, amíg elvégzik távolról a beállításokat.\nElőző munkalap: 17159",
          },
        ]}
      />

      <InvoiceDates
        dates={[
          { label: 'Indulás', value: '13:30' },
          { label: 'Érkezés', value: '14:00' },
          { label: 'Távozás', value: '17:50' },
          { label: 'Visszaérkezés', value: '18:20' },
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
        <Text className="ml-16 leading-[1.7]">
          Tájékoztatjuk Önt, hogy a jelen dokumentumban feltűntetett személyes
          adatokat a BBOX Solutions Kft. mint adatkezelő, az Adatkezelési
          tájékoztatójában foglaltak szerint megfelelően kezeli. A teljes
          vételár kifizetéséig a felsorolt termékek a BBOX Solutions Kft.
          tulajdonsát képezil. Kérjük igazolja vissza a munkát és aláírtan
          lepecsételve részünkre a munkalapot.
        </Text>
      </div>
      <div className="flex flex-col-reverse items-start justify-between border-t border-gray-300 pb-4 pt-8 xs:flex-row">
        {/* Signature Section */}
        <div className="flex flex-col items-start">
          <div className="mb-4 flex h-32 w-64 items-center justify-center bg-gray-100">
            <span>Signature Here</span>{' '}
            {/* Replace with signature image if available */}
          </div>
          <div className="text-sm">
            <p className="text-gray-600">Aláírva: 2024.11.02. - 16:44</p>
            <p className="text-gray-600">
              Aláíró neve: <span className="font-bold">Dávid Gábor</span>
            </p>
          </div>
        </div>

        {/* Invoice Summary Section */}
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between border-b border-gray-300 pb-3.5 lg:pb-5">
            <span className="text-sm text-gray-600">
              Nettó számla érték (ÁFA nélkül):
            </span>
            <span className="text-sm font-semibold">177 100 HUF</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-300 py-3.5 lg:py-5">
            <span className="text-sm text-gray-600">27% összege:</span>
            <span className="text-sm font-semibold">47 817 HUF</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-300 py-3.5 lg:py-5">
            <span className="text-sm text-gray-600">Kedvezmény:</span>
            <span className="text-sm font-semibold">0%</span>
          </div>
          <div className="flex items-center justify-between pt-4 text-lg font-semibold text-gray-900 lg:pt-5">
            <span>Összesen:</span>
            <span className="text-emerald-600">224 917 HUF</span>
          </div>
        </div>
      </div>

      {/*<div className="flex flex-col-reverse items-start justify-between border-t border-muted pb-4 pt-8 xs:flex-row">
        <div>SIGN HERE</div>
        <div className="w-full max-w-sm">
          <Text className="flex items-center justify-between border-b border-muted pb-3.5 lg:pb-5">
            Subtotal:{' '}
            <Text as="span" className="font-semibold">
              $700
            </Text>
          </Text>
          <Text className="flex items-center justify-between border-b border-muted py-3.5 lg:py-5">
            Shipping:{' '}
            <Text as="span" className="font-semibold">
              $142
            </Text>
          </Text>
          <Text className="flex items-center justify-between border-b border-muted py-3.5 lg:py-5">
            Discount:{' '}
            <Text as="span" className="font-semibold">
              $250
            </Text>
          </Text>
          <Text className="flex items-center justify-between border-b border-muted py-3.5 lg:py-5">
            Taxes:
            <Text as="span" className="font-semibold">
              15%
            </Text>
          </Text>
          <Text className="flex items-center justify-between pt-4 text-base font-semibold text-gray-900 lg:pt-5">
            Total: <Text as="span">$659.5</Text>
          </Text>
        </div>
      </div>*/}
    </div>
  );
}
