'use client';

import { routes } from '@/config/routes';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { InvoiceTableDataType } from './table';
import { CoworkersTableDataType } from './coworkersTable';

const columnHelper = createColumnHelper<CoworkersTableDataType>();

export const coworkersColumns = [
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
    size: 300,
    header: 'FELHASZNÁLÓ',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <AvatarCard
          hasAvatar={true}
          src={row.original.avatar}
          name={row.original.name}
          description={row.original.email}
          //badge={row.original.badge}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'email',
    size: 150,
    header: 'JOGKÖR',
    cell: ({ row }) => row.original.role, //TODO make type for it
  }),
  columnHelper.accessor('dueDate', {
    id: 'dueDate',
    size: 200,
    header: 'UTOLSÓ BELÉPÉS',
    cell: ({ row }) => <DateCell date={new Date(row.original.dueDate)} />,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 70,
    header: 'STÁTUSZ',
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status, true),
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
        deletePopoverTitle="Munkatárs törlése"
        deletePopoverDescription="Biztosan törölni szeretnéd a munkatársat?"
        onDelete={() => {
          meta?.handleDeleteRow?.(row.original);
        }}
      />
    ),
  }),
];
