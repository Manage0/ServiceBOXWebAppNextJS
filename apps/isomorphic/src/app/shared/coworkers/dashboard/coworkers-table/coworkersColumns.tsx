'use client';
import AvatarCard from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from 'rizzui';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
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
  columnHelper.accessor('forename', {
    id: 'name',
    size: 300,
    header: 'FELHASZNÁLÓ',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <AvatarCard
          hasAvatar={true}
          src={row.original.profile_picture}
          name={row.original.forename + ' ' + row.original.surname}
          description={row.original.email}
        />
      );
    },
  }),
  columnHelper.accessor('role_name', {
    id: 'role_name',
    size: 150,
    header: 'JOGKÖR',
    enableSorting: true,
    cell: ({ row }) => row.original.role_name,
  }),
  columnHelper.accessor('last_login', {
    id: 'last_login',
    size: 200,
    header: 'UTOLSÓ BELÉPÉS',
    cell: ({ row }) => {
      if (row.original.last_login) {
        return (
          <DateCell
            date={new Date(row.original.last_login)}
            dateFormat="YYYY. MM. DD."
            timeFormat="hh:mm"
          />
        );
      } else {
        return 'Még nem jelentkezett be';
      }
    },
  }),
  columnHelper.display({
    id: 'status',
    size: 70,
    header: 'STÁTUSZ',
    cell: ({ row }) => {
      //TODO check this, majd amikor a lastActivity middleware megjelenik
      const last_activity = new Date(row.original.last_activity);
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      const status =
        now.getTime() - last_activity.getTime() <= fiveMinutes
          ? 'Online'
          : 'Offline';

      return getStatusBadge(status, true);
    },
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
        editUrl={/**TODO edit modal pop-up and implementation here */ ''}
        deletePopoverTitle="Munkatárs törlése"
        deletePopoverDescription="Biztosan törölni szeretnéd a munkatársat?"
        onDelete={() => {
          /**TODO Implement Delete user function
           * -- úgy kéne, hogy tömböt fogadjon, de itt az egy elemű, tehát a multi-delete is okés
           * -- Ahogy nézem, ezt tényleg feljebb kell definiálni, úgyhogy legyen ott. Itt csak hívd meg
           *
           * Hint:  meta?.handleDeleteRow?.(row.original);
           */
        }}
      />
    ),
  }),
];
