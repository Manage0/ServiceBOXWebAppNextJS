'use client';

import { routes } from '@/config/routes';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { ProductsDataType } from '../../ecommerce/dashboard/stock-report';

const columnHelper = createColumnHelper<ProductsDataType>();

export const productsColumns = [
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
    header: 'TERMÉKNÉV / KATEGÓRIA',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <AvatarCard
          hasAvatar={true}
          src={row.original.image}
          name={row.original.name}
          description={row.original.category}
          //badge={row.original.badge}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'itemNum',
    size: 150,
    header: 'CIKKSZÁM',
    cell: ({ row }) => row.original.sku, //TODO make type for it
  }),
  columnHelper.display({
    id: 'price',
    size: 150,
    header: 'HUF DARABÁR',
    cell: ({ row }) => parseInt(row.original.price).toString() + '0 HUF', //TODO make type for it
  }),
  columnHelper.display({
    id: 'stock',
    size: 150,
    header: 'RAKTÁR',
    cell: ({ row }) => row.original.stock + ' db', //TODO make type for it
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
        deletePopoverTitle="Termék törlése"
        deletePopoverDescription="Biztosan törölni szeretnéd a terméket?"
        onDelete={() => {
          meta?.handleDeleteRow?.(row.original);
        }}
      />
    ),
  }),
];
