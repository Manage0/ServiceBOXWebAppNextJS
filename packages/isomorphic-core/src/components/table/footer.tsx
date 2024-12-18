import { Button, Text } from "rizzui";
import { Table as ReactTableType } from "@tanstack/react-table";
import Image from "next/image";

interface TableToolbarProps<TData extends Record<string, any>> {
  table: ReactTableType<TData>;
  showDownloadButton?: boolean;
  onExport?: () => void;
}

export default function TableFooter<TData extends Record<string, any>>({
  table,
  showDownloadButton = true,
  onExport,
}: TableToolbarProps<TData>) {
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
          <div className="opacity-100 text-[rgba(196,104,81,1)] font-inter text-[12px] font-normal not-italic tracking-[0px] text-left underline">
            Töröld őket
          </div>
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {showDownloadButton && (
          <Button
            size="sm"
            onClick={onExport}
            className="bg-white me-[20px] border-0 border-[1px] border-[#E3E3E3] text-[#484848] hover:bg-gray-100 hover:border-[#E3E3E3] hover:text-[#484848]"
          >
            <Image
              src={"/Download.svg"}
              alt="Users icon"
              width={17}
              height={17}
              className="me-1.5"
            />
            Letöltés
          </Button>
        )}
        {showDownloadButton && (
          <Button
            size="sm"
            onClick={onExport}
            className="dark:bg-gray-300 dark:text-gray-800"
          >
            <Image
              src={"/Sign.svg"}
              alt="Users icon"
              width={17}
              height={17}
              className="me-1.5"
            />
            Aláírásra küld ({checkedItems.length})
          </Button>
        )}
      </div>
    </div>
  );
}
