import { Text, Avatar, AvatarProps } from "rizzui";
import cn from "../utils/class-names";
import Badge from "./Badge";

interface AvatarCardProps {
  src?: string;
  name: string;
  className?: string;
  nameClassName?: string;
  avatarProps?: AvatarProps;
  description?: React.ReactNode;
  badge?: string;
  hasAvatar?: true;
}

export default function AvatarCard({
  src,
  name,
  className,
  description,
  avatarProps,
  badge,
  nameClassName,
  hasAvatar,
}: AvatarCardProps) {
  return (
    <figure
      className={cn("flex items-center justify-between gap-3", className)}
    >
      <figcaption className="flex justify-between">
        {hasAvatar && (
          <Avatar name={name} src={src} {...avatarProps} className="mr-2" />
        )}
        <div className="flex flex-col">
          <Text
            className={cn(
              "font-lexend text-sm font-medium text-gray-900 dark:text-gray-700",
              nameClassName
            )}
          >
            {name}
          </Text>
          {description && (
            <Text className="text-[13px] text-gray-500">{description}</Text>
          )}
        </div>
      </figcaption>

      {badge && <Badge text={badge} />}
      {/**make a type for it TODO de a munkalaphoz és azt használd!!! */}
    </figure>
  );
}
