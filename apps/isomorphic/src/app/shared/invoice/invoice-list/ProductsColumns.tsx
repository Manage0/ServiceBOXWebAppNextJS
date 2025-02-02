'use client';

import AvatarCard from '@core/ui/avatar-card';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from 'rizzui';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { ProductType } from '@/data/prod-data';

const columnHelper = createColumnHelper<ProductType>();

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
    cell: ({ row }) => row.original.id, //TODO make type for it
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
    cell: ({ row }) =>
      row.original.stock.toString() + ' ' + row.original.measure, //TODO make type for it
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 70,
    header: 'STÁTUSZ',
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status, true),
  }),
];
