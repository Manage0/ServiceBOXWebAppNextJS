import { Title, Text, ActionIcon, Button, Popover, Tooltip } from "rizzui";
import { PiTrashFill } from "react-icons/pi";
import Image from "next/image";

type DeletePopoverProps = {
  title: string;
  description: string;
  onDelete?: () => void;
};

export default function DeletePopover({
  title,
  description,
  onDelete,
}: DeletePopoverProps) {
  return (
    <Popover placement="left">
      <Popover.Trigger>
        <div>
          <Tooltip size="sm" content="Törlés" placement="top" color="invert">
            <ActionIcon
              size="sm"
              variant="outline"
              aria-label={"Delete Item"}
              className="cursor-pointer"
            >
              <Image
                src={"/Bin.svg"}
                alt="Users icon"
                width={15}
                height={15}
                className="size-4"
              />
            </ActionIcon>
          </Tooltip>
        </div>
      </Popover.Trigger>
      <Popover.Content className="z-10">
        {({ setOpen }) => (
          <div className="w-56 pb-2 pt-1 text-left rtl:text-right">
            <Title
              as="h6"
              className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center"
            >
              <PiTrashFill className="me-1 size-[17px]" /> {title}
            </Title>
            <Text className="mb-2 leading-relaxed text-gray-500">
              {description}
            </Text>
            <div className="flex items-center justify-end">
              <Button
                size="sm"
                className="me-1.5 h-7"
                onClick={() => {
                  onDelete && onDelete();
                  setOpen(false);
                }}
              >
                Igen
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setOpen(false)}
              >
                Nem
              </Button>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
