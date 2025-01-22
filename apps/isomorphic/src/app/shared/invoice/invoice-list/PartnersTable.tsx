'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import TablePagination from '@core/components/table/pagination';

import { PartnerType } from '@/data/partners-data';
import { PartnersColumns } from './PartnersColumns';
import { useEffect } from 'react';
import OnlyMultiDeleteTableFooter from '../../coworkers/dashboard/coworkers-table/OnlyMultiDeleteTableFooter';

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
        handleDeleteRow: async (row) => {
          await deletePartners([row.id]);
        },
        handleMultipleDelete: async (rows: PartnerType[]) => {
          const partnerIdsToDelete = rows.map((row: PartnerType) => row.id);
          await deletePartners(partnerIdsToDelete);
        },
        /*handleEdit(row) {
          openModal({
            view: (
              <AddPartnerModalView
                isLoading={isLoading}
                setLoading={setLoading}
                selectedPartner={row}
              />
            ),
          });
        },*/
      },
      enableColumnResizing: false,
    },
  });

  const deletePartners = async (partnerIdsToDelete: string[]) => {
    try {
      const res = await fetch('/api/partners', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partner_ids: partnerIdsToDelete }),
      });

      if (res.ok) {
        setData((prev) =>
          prev.filter((r) => !partnerIdsToDelete.includes(r.id))
        );
      } else {
        console.error('Failed to delete partners:', await res.json());
      }
    } catch (error) {
      console.error('Error deleting partners:', error);
    }
  };

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
      <OnlyMultiDeleteTableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
