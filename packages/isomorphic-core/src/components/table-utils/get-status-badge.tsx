import cn from "@core/utils/class-names";
import { Badge, Flex, Text } from "rizzui";
import { replaceUnderscoreDash } from "@core/utils/replace-underscore-dash";

const statusColors = {
  success: ["text-green-dark", "bg-green-dark", "bg-green-100"],
  warning: ["text-orange-dark", "bg-orange-dark", "bg-orange-100"],
  danger: ["text-red-dark", "bg-red-dark", "bg-red-100"],
  default: ["text-gray-600", "bg-gray-600", "bg-gray-100"],
  offline: ["text-gray-600", "bg-[#c46851]", "bg-gray-100"],
  vázlat: ["text-[#b2b2b2]", "bg-[#b2b2b2]", "bg-white"],
};

const allStatus = {
  online: statusColors.success,
  offline: statusColors.offline,
  pending: statusColors.warning,
  paid: statusColors.success,
  overdue: statusColors.danger,
  completed: statusColors.success,
  cancelled: statusColors.danger,
  publish: statusColors.success,
  approved: statusColors.success,
  rejected: statusColors.danger,
  active: statusColors.success,
  deactivated: statusColors.danger,
  on_going: statusColors.warning,
  at_risk: statusColors.danger,
  delayed: statusColors.default,
  draft: statusColors.default,
  refunded: statusColors.default,
  vázlat: statusColors.vázlat,
  aktív: statusColors.success,
};

export type StatusTypes = keyof typeof allStatus;

export function getStatusBadge(status: string, hasBadge?: Boolean) {
  /**TODO use as badge, ha nincs más */
  const statusLower = status.toLowerCase() as StatusTypes;
  if (hasBadge && statusLower in allStatus) {
    return (
      <Flex
        align="center"
        gap="2"
        className={cn(
          "rounded-full px-1 py-1 w-[90px] pl-[10px]",
          allStatus[statusLower][2]
        )}
      >
        <Badge renderAsDot className={allStatus[statusLower][1]} />
        <Text
          className={cn("font-medium capitalize", allStatus[statusLower][0])}
        >
          {replaceUnderscoreDash(statusLower)}
        </Text>
      </Flex>
    );
  }
  if (statusLower in allStatus) {
    return (
      <Flex align="center" gap="2" className="w-auto">
        <Badge renderAsDot className={allStatus[statusLower][1]} />
        <Text
          className={cn("font-medium capitalize", allStatus[statusLower][0])}
        >
          {replaceUnderscoreDash(statusLower)}
        </Text>
      </Flex>
    );
  }
  return (
    <Flex align="center" gap="2" className="w-auto">
      <Badge renderAsDot className="bg-gray-600" />
      <Text className="font-medium capitalize text-gray-600">
        {replaceUnderscoreDash(statusLower)}
      </Text>
    </Flex>
  );
}
