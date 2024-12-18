'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import TablePagination from '@core/components/table/pagination';

import TableFooter from '@core/components/table/footer';
import { productsData } from '@/data/products-data';
import { productsColumns } from './ProductsColumns';
export type ProductsTableDataType = (typeof productsData)[number];

export type SearchableTableProps = {
  searchbarPlaceholder: string;
};

export default function ProductsTable({
  searchbarPlaceholder,
}: SearchableTableProps) {
  const { table, setData } = useTanStackTable<ProductsTableDataType>({
    tableData: productsData,
    columnConfig: productsColumns,
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
      <Filters
        table={table}
        searchbarPlaceholder={searchbarPlaceholder}
        dropdownProps={{
          options: [
            { label: 'Kategória', value: 'Kategória' },
            { label: 'Fiskálnyomtató', value: 'Fiskálnyomtató' },
          ],
          onChange: (value) => {
            console.log('Selected value:', value);
          },
        }}
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
