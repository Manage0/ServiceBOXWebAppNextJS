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
  editAction,
  viewUrl,
  comment,
  deletePopoverTitle = "Delete the appointment",
  deletePopoverDescription = "Are you sure you want to delete this item?",
  className,
}: {
  onDelete?: () => void;
  comment?: string;
  editUrl?: string;
  editAction?: () => void;
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
      {comment && (
        <Tooltip size="sm" content={comment} placement="top" color="invert">
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
        </Tooltip>
      )}
      {editUrl && (
        <Tooltip size="sm" content="Szerkesztés" placement="top" color="invert">
          <Link href={editUrl}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              aria-label="Szerkesztés"
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
      {editAction && (
        <Tooltip size="sm" content="Szerkesztés" placement="top" color="invert">
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            aria-label="Szerkesztés"
            onClick={editAction}
          >
            <Image
              src={"/Edit.svg"}
              alt="Users icon"
              width={15}
              height={15}
              className="size-4"
            />
          </ActionIcon>
        </Tooltip>
      )}
      {viewUrl && (
        <Tooltip
          size="sm"
          content="Nyomtatási kép"
          placement="top"
          color="invert"
        >
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
