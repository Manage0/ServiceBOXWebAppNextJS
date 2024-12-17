'use client';

import { invoiceData } from '@/data/invoice-data';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import { invoiceListColumns } from './columns';
import TablePagination from '@core/components/table/pagination';

import TableFooter from '@core/components/table/footer';
export type InvoiceTableDataType = (typeof invoiceData)[number];

export default function InvoiceTable() {
  const { table, setData } = useTanStackTable<InvoiceTableDataType>({
    tableData: invoiceData,
    columnConfig: invoiceListColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
        },
      },
      enableColumnResizing: false,
    },
  });

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
