import EyeIcon from "@core/components/icons/eye";
import PencilIcon from "@core/components/icons/pencil";
import { ActionIcon, Flex, Tooltip } from "rizzui";
import Link from "next/link";
import cn from "@core/utils/class-names";
import DeletePopover from "../delete-popover";
import Image from "next/image";

export default function TableRowActionGroup({
  onDelete,
  editUrl,
  viewUrl,
  messageUrl,
  deletePopoverTitle = "Delete the appointment",
  deletePopoverDescription = "Are you sure you want to delete this item?",
  className,
}: {
  onDelete?: () => void;
  messageUrl?: string;
  editUrl?: string;
  viewUrl?: string;
  deletePopoverTitle?: string;
  deletePopoverDescription?: string;
  className?: string;
}) {
  return (
    <Flex
      align="center"
      justify="end"
      gap="3"
      className={cn("pe-3", className)}
    >
      {messageUrl && (
        <Tooltip size="sm" content="Üzenet" placement="top" color="invert">
          <Link href={messageUrl}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              aria-label="Edit Item"
            >
              <Image
                src={"/Messages.svg"}
                alt="Users icon"
                width={15}
                height={15}
                className="size-4"
              />
            </ActionIcon>
          </Link>
        </Tooltip>
      )}
      {editUrl && (
        <Tooltip size="sm" content="Edit Item" placement="top" color="invert">
          <Link href={editUrl}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              aria-label="Edit Item"
            >
              <Image
                src={"/Edit.svg"}
                alt="Users icon"
                width={15}
                height={15}
                className="size-4"
              />
            </ActionIcon>
          </Link>
        </Tooltip>
      )}
      {viewUrl && (
        <Tooltip size="sm" content="View Item" placement="top" color="invert">
          <Link href={viewUrl}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              aria-label="View item"
            >
              <Image
                src={"/View.svg"}
                alt="Users icon"
                width={15}
                height={15}
                className="size-4"
              />
            </ActionIcon>
          </Link>
        </Tooltip>
      )}
      {onDelete && (
        <DeletePopover
          title={deletePopoverTitle}
          description={deletePopoverDescription}
          onDelete={onDelete}
        />
      )}
    </Flex>
  );
}
