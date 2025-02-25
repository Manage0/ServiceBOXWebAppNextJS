'use client';

import { routes } from '@/config/routes';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

const columnHelper = createColumnHelper<WorksheetFormTypes>();

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
  columnHelper.accessor('worksheet_id', {
    id: 'worksheet_id',
    size: 250,
    header: 'MUNKALAPSZÁM / MUNKATÁRS',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <AvatarCard
          name={row.original.worksheet_id}
          description={row.original.creator_name}
          badge={row.original.badge}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'partner_name',
    size: 280,
    header: 'VEVŐ',
    cell: ({ row }) => row.original.partner_name,
  }),
  columnHelper.accessor('creation_date', {
    id: 'creation_date',
    size: 200,
    header: 'LÉTREHOZÁS DÁTUMA',
    cell: ({ row }) =>
      row.original.creation_date ? (
        <DateCell
          dateFormat="YYYY. MM. DD."
          timeFormat="hh:mm"
          date={new Date(row.original.creation_date)}
        />
      ) : (
        <Text>Létrehozási dátum nem elérhető</Text>
      ),
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
        editUrl={row.original.id ? routes.worksheets.edit(row.original.id) : ''}
        comment={row.original.public_comment}
        viewUrl={
          row.original.id ? routes.worksheets.details(row.original.id) : ''
        }
        deletePopoverTitle="Munkalap törlése"
        deletePopoverDescription="Biztosan törölni szeretnéd a munkalapot?"
        onDelete={() => {
          meta?.handleDeleteRow?.(row.original);
        }}
      />
    ),
  }),
];
