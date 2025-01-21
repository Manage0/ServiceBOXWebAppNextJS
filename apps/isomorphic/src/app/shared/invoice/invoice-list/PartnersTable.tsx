'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import TablePagination from '@core/components/table/pagination';

import TableFooter from '@core/components/table/footer';
import { PartnerType } from '@/data/partners-data';
import { PartnersColumns } from './PartnersColumns';
import { useEffect } from 'react';

export type SearchableTableProps = {
  searchbarPlaceholder: string;
};

export default function PartnersTable({
  searchbarPlaceholder,
}: SearchableTableProps) {
  const { table, setData } = useTanStackTable<PartnerType>({
    tableData: [],
    columnConfig: PartnersColumns,
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
    async function getUsers() {
      try {
        const res = await fetch('/api/partners', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data: PartnerType[] = (await res.json()) as PartnerType[];
          setData(data);
        } else {
          console.error('Failed to fetch partners:', await res.json());
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    }
    getUsers();
  }, [setData]);

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
