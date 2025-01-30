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
  const [partners, setPartners] = useState<{ label: string; value: string }[]>(
    []
  );
  const [allData, setAllData] = useState<WorksheetFormTypes[]>([]);
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
        setAllData(data);
        setData(data);
      } catch (error) {
        console.error('Error fetching worksheet data:', error);
      }
    };

    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        if (!res.ok) {
          throw new Error('Failed to fetch partners');
        }
        const data = (await res.json()) as { id: string; name: string }[];
        const partnerOptions = data.map(
          (partner: { id: string; name: string }) => ({
            label: partner.name,
            value: partner.name,
          })
        );
        setPartners(partnerOptions);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchWorksheetData();
    fetchPartners();
  }, [setData]);

  const handleFilterChange = (selectedPartner: string | null) => {
    if (selectedPartner) {
      const filtered = allData.filter(
        (worksheet) => worksheet.partner_name === selectedPartner
      );
      setData(filtered);
    } else {
      setData(allData);
    }
  };

  return (
    <>
      <Filters
        table={table}
        dropdownProps={{
          options: partners,
          onChange: (value) => {
            handleFilterChange(value);
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
