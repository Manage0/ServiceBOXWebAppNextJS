import { type Table as ReactTableType } from "@tanstack/react-table";
import {
  ActionIcon,
  Box,
  Flex,
  Grid,
  Select,
  SelectOption,
  Text,
} from "rizzui";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import cn from "@core/utils/class-names";

const options = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
  { value: 25, label: "25" },
];

export default function TablePagination<TData extends Record<string, any>>({
  table,
  showSelectedCount = false,
  className,
}: {
  table: ReactTableType<TData>;
  showSelectedCount?: boolean;
  className?: string;
}) {
  return (
    <Flex
      gap="6"
      align="center"
      justify="between"
      className={cn("@container", className)}
    >
      <Flex align="center" className="w-auto shrink-0">
        <Text className="hidden font-normal text-gray-600 @md:block">
          Sor oldalanként:
        </Text>
        <Select
          options={options}
          size="md"
          className="w-15"
          value={table.getState().pagination.pageSize}
          onChange={(v: SelectOption) => {
            table.setPageSize(Number(v.value));
          }}
          suffixClassName="[&>svg]:size-3"
          selectClassName="font-semibold text-xs ring-0 shadow-sm h-9"
          optionClassName="font-medium text-xs px-2 justify-center"
        />
      </Flex>
      {showSelectedCount && (
        <Box className="hidden @2xl:block w-full">
          <Text>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </Text>
        </Box>
      )}
      <Flex justify="end" align="center">
        <div className="flex items-center justify-center gap-2">
          {/* Előző oldal */}
          <button
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 1)
            }
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 disabled:text-gray-400"
          >
            <PiCaretLeftBold className="h-4 w-4" />
          </button>

          {/* Oldalszámok */}
          {[...Array(table.getPageCount())].map((_, index) => {
            const page = index + 1;
            return (
              <div
                key={page}
                //onClick={() => table.setPageIndex(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                  table.getState().pagination.pageIndex + 1 === page
                    ? "bg-custom-green text-white"
                    : "text-gray-700 " //hover:bg-gray-100"
                }`}
              >
                {page}
              </div>
            );
          })}

          {/* Következő oldal */}
          <button
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 1)
            }
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 disabled:text-gray-400"
          >
            <PiCaretRightBold className="h-4 w-4" />
          </button>
        </div>
      </Flex>
    </Flex>
  );
}
