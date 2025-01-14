import { Button, Text } from 'rizzui';
import { Table as ReactTableType } from '@tanstack/react-table';

interface TableToolbarProps<TData extends Record<string, any>> {
  table: ReactTableType<TData>;
}

export default function CoworkersTableFooter<
  TData extends Record<string, any>,
>({ table }: TableToolbarProps<TData>) {
  const checkedItems = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const meta = table.options.meta;

  if (checkedItems.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 z-10 mt-2.5 flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-0 px-5 py-3.5 text-gray-900 shadow-sm dark:border-gray-300 dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
      <div>
        <Text as="strong">{checkedItems.length}</Text> kijelölve
        <Button
          size="sm"
          variant="text"
          color="danger"
          onClick={() => meta?.handleMultipleDelete?.(checkedItems)}
        >
          <div className="text-left font-inter text-[12px] font-normal not-italic tracking-[0px] text-[rgba(196,104,81,1)] underline opacity-100">
            Töröld őket
          </div>
        </Button>
      </div>
    </div>
  );
}
