'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import TablePagination from '@core/components/table/pagination';

import TableFooter from '@core/components/table/footer';
import { coworkersColumns } from './cowrokersColumns';
import { coworkersData } from '@/data/coworkers-data';
export type CoworkersTableDataType = (typeof coworkersData)[number];

export type SearchableTableProps = {
  searchbarPlaceholder: string;
};

export default function CoworkersTable({
  searchbarPlaceholder,
}: SearchableTableProps) {
  const { table, setData } = useTanStackTable<CoworkersTableDataType>({
    tableData: coworkersData,
    columnConfig: coworkersColumns,
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
      <Filters table={table} searchbarPlaceholder={searchbarPlaceholder} />
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
