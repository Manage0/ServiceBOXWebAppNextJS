import { Text, Avatar, AvatarProps } from "rizzui";
import cn from "../utils/class-names";
import Badge from "./Badge";

interface AvatarCardProps {
  src: string;
  name: string;
  className?: string;
  nameClassName?: string;
  avatarProps?: AvatarProps;
  description?: React.ReactNode;
  badge?: string;
}

export default function AvatarCard({
  src,
  name,
  className,
  description,
  avatarProps,
  badge,
  nameClassName,
}: AvatarCardProps) {
  return (
    <figure
      className={cn("flex items-center justify-between gap-3", className)}
    >
      {/*<Avatar
        name={name}
        src={src}
        {...avatarProps}
      />*/}
      <figcaption className="grid gap-0.5">
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
      </figcaption>
      {badge && <Badge text={badge} />}
      {/**make a type for it TODO de a munkalaphoz és azt használd!!! */}
    </figure>
  );
}
