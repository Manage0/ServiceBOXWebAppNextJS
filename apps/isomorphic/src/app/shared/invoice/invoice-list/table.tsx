'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import { invoiceListColumns } from './columns';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

export type SearchableTableProps = {
  searchbarPlaceholder: string;
};

export default function InvoiceTable({
  searchbarPlaceholder,
}: SearchableTableProps) {
  const { table, setData } = useTanStackTable<WorksheetFormTypes>({
    tableData: [],
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

  useEffect(() => {
    const fetchWorksheetData = async () => {
      try {
        const res = await fetch('/api/worksheets');
        if (!res.ok) {
          throw new Error('Failed to fetch worksheet data');
        }
        const data: WorksheetFormTypes[] =
          (await res.json()) as WorksheetFormTypes[];
        setData(data);
      } catch (error) {
        console.error('Error fetching worksheet data:', error);
      }
    };

    fetchWorksheetData();
  }, [setData]);

  return (
    <>
      <Filters
        table={table}
        dropdownProps={{
          options: [
            { label: 'Partner', value: 'Partner' },
            { label: 'Unixino', value: 'Unixino' },
          ],
          onChange: (value) => {
            console.log('Selected value:', value);
          },
        }}
        searchbarPlaceholder={searchbarPlaceholder}
      />
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
