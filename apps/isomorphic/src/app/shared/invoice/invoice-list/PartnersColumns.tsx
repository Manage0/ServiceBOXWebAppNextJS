'use client';

import { routes } from '@/config/routes';
import AvatarCard from '@core/ui/avatar-card';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from 'rizzui';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import { PartnerType } from '@/data/partners-data';

const columnHelper = createColumnHelper<PartnerType>();

export const PartnersColumns = [
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
    size: 200,
    header: 'PARTNER / KÜLSŐ ID',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <AvatarCard
          //hasAvatar={true}
          name={row.original.name}
          description={row.original.external_id}
          //badge={row.original.badge}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'itemNum',
    size: 100,
    header: 'ADÓSZÁM',
    cell: ({ row }) => row.original.tax_num, //TODO make type for it
  }),
  columnHelper.display({
    id: 'address',
    size: 200,
    header: 'CÍM',
    cell: ({ row }) => {
      return (
        <AvatarCard
          name={row.original.city + ', ' + row.original.address}
          description={row.original.country + ' - ' + row.original.postal_code}
          //badge={row.original.badge}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'contact',
    size: 150,
    header: 'KAPCSOLATTARTÓ',
    cell: ({ row }) => row.original.contact_person, //TODO make type for it
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
        deletePopoverTitle="Partner törlése"
        deletePopoverDescription="Biztosan törölni szeretnéd a partnert?"
        //TODO implement delete, when creation is ok
        onDelete={() => {
          meta?.handleDeleteRow?.(row.original);
        }}
      />
    ),
  }),
];
