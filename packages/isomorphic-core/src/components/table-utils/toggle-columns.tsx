import { ActionIcon, Checkbox, Popover, Title } from "rizzui";
import { type Table as ReactTableType } from "@tanstack/react-table";
import Image from "next/image";

export default function ToggleColumns<TData extends Record<string, any>>({
  table,
}: {
  table: ReactTableType<TData>;
}) {
  return (
    <Popover shadow="sm" placement="bottom-end">
      <Popover.Trigger>
        <ActionIcon
          variant="outline"
          title="Toggle Columns"
          className="h-9 p-1 self-start"
        >
          <Image src={"/Tasks.svg"} alt="Users icon" width={18} height={18} />
        </ActionIcon>
      </Popover.Trigger>
      <Popover.Content className="z-0">
        <div className="p-2 text-left rtl:text-right">
          <Title as="h6" className="mb-6 px-0.5 text-sm font-semibold">
            Oszlopok megjelenítése
          </Title>
          <div className="grid grid-cols-2 gap-6">
            {table.getAllLeafColumns().map((column) => {
              return (
                typeof column.columnDef.header === "string" &&
                column.columnDef.header.length > 0 && (
                  <Checkbox
                    key={column.id}
                    label={<>{column.columnDef.header}</>}
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                )
              );
            })}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}
