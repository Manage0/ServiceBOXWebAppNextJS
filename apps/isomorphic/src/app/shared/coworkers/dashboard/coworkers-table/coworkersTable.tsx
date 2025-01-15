'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './coworkersFilters';
import TablePagination from '@core/components/table/pagination';
import { coworkersColumns } from './coworkersColumns';
import { coworkersData } from '@/data/coworkers-data';
import CoworkersTableFooter from './coworkersTableFooter';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';

export type CoworkersTableDataType = (typeof coworkersData)[number];

export type SearchableTableProps = {
  searchbarPlaceholder: string;
  isLoading: boolean;
};

export default function CoworkersTable({
  searchbarPlaceholder,
  isLoading,
}: SearchableTableProps) {
  const { table, setData } = useTanStackTable<CoworkersTableDataType>({
    tableData: [],
    columnConfig: coworkersColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row) => {
          await deleteUsers([row.id]);
        },
        handleMultipleDelete: async (rows: CoworkersTableDataType[]) => {
          const userIdsToDelete = rows.map(
            (row: CoworkersTableDataType) => row.id
          );
          await deleteUsers(userIdsToDelete);
        },
      },
      enableColumnResizing: false,
    },
  });

  const deleteUsers = async (userIdsToDelete: string[]) => {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_ids: userIdsToDelete }),
      });

      if (res.ok) {
        setData((prev) => prev.filter((r) => !userIdsToDelete.includes(r.id)));
      } else {
        console.error('Failed to delete users:', await res.json());
      }
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  useEffect(() => {
    async function getUsers() {
      try {
        const session = await getSession();
        const userId = session?.user?.id;

        const res = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }), // Send user_id in the request body
        });

        if (res.ok) {
          const data: CoworkersTableDataType[] =
            (await res.json()) as CoworkersTableDataType[];
          setData(data);
        } else {
          console.error('Failed to fetch roles:', await res.json());
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }
    getUsers();
  }, [setData, isLoading]);

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
      <CoworkersTableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
