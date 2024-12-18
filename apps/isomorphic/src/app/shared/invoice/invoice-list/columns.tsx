'use client';

import { routes } from '@/config/routes';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { InvoiceTableDataType } from './table';

const columnHelper = createColumnHelper<InvoiceTableDataType>();

export const invoiceListColumns = [
  columnHelper.display({
    id: 'select',
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3"
        aria-label="Select All"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ps-3"
        aria-label="Select Row"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor('name', {
    id: 'name',
    size: 250,
    header: 'MUNKALAPSZÁM / MUNKATÁRS',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <AvatarCard
          src={row.original.avatar}
          name={`PPRK-${row.original.id}`}
          description={row.original.name}
          badge={row.original.badge}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'email',
    size: 280,
    header: 'VEVŐ',
    cell: ({ row }) => row.original.email.toLowerCase(),
  }),
  columnHelper.accessor('amount', {
    id: 'amount',
    size: 200,
    header: 'ÖSSZEG',
    cell: ({ row }) => (
      <Text className="text-sm font-medium">${row.original.amount}</Text>
    ),
  }),
  columnHelper.accessor('dueDate', {
    id: 'dueDate',
    size: 200,
    header: 'LÉTREHOZÁS DÁTUMA',
    cell: ({ row }) => <DateCell date={new Date(row.original.dueDate)} />,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 150,
    header: 'STÁTUSZ',
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status),
  }),
  columnHelper.display({
    id: 'actions',
    size: 120,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <TableRowActionGroup
        editUrl={routes.invoice.edit(row.original.id)}
        viewUrl={routes.invoice.details(row.original.id)}
        onDelete={() => {
          meta?.handleDeleteRow?.(row.original);
        }}
      />
    ),
  }),
];
