'use client';

import cn from '@core/utils/class-names';
import {
  PiArrowUpRightBold,
  PiArrowDownRightBold,
  PiPlusBold,
} from 'react-icons/pi';
import SimpleBar from 'simplebar-react';
import { Box, Button, Flex, Text, Title } from 'rizzui';
import { formatNumber } from '@core/utils/format-number';
import { StatType, projectStatData } from '@/data/project-dashboard';
import Link from 'next/link';

export type StatCardProps = {
  className?: string;
  transaction: StatType;
};

export default function ProjectStats({ className }: { className?: string }) {
  return (
    <Box className={cn('@container', className)}>
      <Flex justify="between" align="center" className="mb-6">
        <Title as="h1" className="text-#333333 font-30 font-lexendBold">
          Jó reggelt, Norbert!
        </Title>
        <Box className="flex flex-col gap-5 @lg:flex-row">
          <Link
            href={'/' /*routes.eCommerce.createProduct*/}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Új munkalap
            </Button>
          </Link>
          <Link
            href={'/' /*routes.eCommerce.createProduct*/}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Új termék
            </Button>
          </Link>
          <Link
            href={'/' /*routes.eCommerce.createProduct*/}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Új partner
            </Button>
          </Link>
        </Box>

        {/**TODO gombok ide jönnek, legyenek linkek, amik a megfelelő oldalra visznek, az elegáns, amúgy use displayname */}
      </Flex>
      <SimpleBar>
        <Flex className="sm:gap-6 3xl:gap-8">
          {projectStatData.map((stat: StatType, index: number) => {
            return <StatCard key={'stat-card-' + index} transaction={stat} />;
          })}
        </Flex>
      </SimpleBar>
    </Box>
  );
}

function StatCard({ className, transaction }: StatCardProps) {
  const { icon, title, amount, increased, percentage } = transaction;
  const Icon = icon;
  return (
    <Box
      className={cn(
        'group inline-block w-full rounded-lg border border-muted p-6 first:bg-slate-900 dark:bg-gray-100/50',
        className
      )}
    >
      <Flex justify="between" gap="5" className="mb-4">
        <Box className="grow space-y-2">
          <Text className="text-[22px] font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-700 2xl:text-[20px] 3xl:text-3xl">
            {formatNumber(amount)}
          </Text>
          <Text className="whitespace-nowrap font-medium text-gray-500 group-first:text-gray-0 dark:group-first:text-gray-500">
            {title}
          </Text>
        </Box>
        <span className="flex rounded-lg bg-slate-200 p-2.5 text-gray-900 shadow-sm dark:bg-gray-50">
          <Icon className="size-7" strokeWidth={2} />
        </span>
      </Flex>
      <Flex align="center" className="gap-1.5">
        <Flex
          gap="1"
          align="center"
          className={cn(increased ? 'text-green' : 'text-red')}
        >
          <span
            className={cn(
              'flex rounded-full',
              increased
                ? 'text-green dark:text-green'
                : 'text-red dark:text-red'
            )}
          >
            {increased ? (
              <PiArrowUpRightBold className="h-auto w-4" />
            ) : (
              <PiArrowDownRightBold className="h-auto w-4" />
            )}
          </span>
          <span className="font-semibold leading-none">
            {increased ? '+' : '-'}
            {percentage}%
          </span>
        </Flex>
        <Flex className="whitespace-nowrap leading-none text-gray-500 group-first:text-gray-0 dark:group-first:text-gray-500">
          &nbsp;+1.01% this week
        </Flex>
      </Flex>
    </Box>
  );
}
