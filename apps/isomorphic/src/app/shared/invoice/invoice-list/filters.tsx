'use client';

import DateFiled from '@core/components/controlled-table/date-field';
import PriceField from '@core/components/controlled-table/price-field';
import StatusField from '@core/components/controlled-table/status-field';
import { FilterDrawerView } from '@core/components/controlled-table/table-filter';
import {
  renderOptionDisplayValue,
  statusOptions,
} from '@/app/shared/invoice/form-utils';
import cn from '@core/utils/class-names';
import { getDateRangeStateValues } from '@core/utils/get-formatted-date';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState } from 'react';
import { PiMagnifyingGlass, PiTrashDuotone } from 'react-icons/pi';
import { useMedia } from 'react-use';
import { Button, Flex, Input } from 'rizzui';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import DropdownAction from '@core/components/charts/dropdown-action';
import Image from 'next/image';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  searchbarPlaceholder?: string;
  dropdownProps?: DropdownProps;
}

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: Option[];
  onChange: (value: string) => void;
};

export default function Filters<TData extends Record<string, any>>({
  table,
  searchbarPlaceholder,
  dropdownProps,
}: TableToolbarProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const isLarge = useMedia('(min-width: 1920px)', false);

  return (
    <Flex align="center" justify="between" className="mb-4 gap-0">
      <Flex align="center" className="flex-wrap">
        <Input
          type="search"
          placeholder={searchbarPlaceholder}
          value={table.getState().globalFilter ?? ''}
          onClear={() => table.setGlobalFilter('')}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          inputClassName="h-9 min-w-[280px]"
          clearable={true}
          prefix={<PiMagnifyingGlass className="h-4 w-4" />}
        />
        {dropdownProps && dropdownProps.options?.length > 0 && (
          <DropdownAction
            className="ml-4 w-[30%] rounded-md border"
            options={dropdownProps.options}
            onChange={dropdownProps.onChange}
            dropdownClassName="!z-0"
            prefixIconClassName="hidden"
          />
        )}
        {isLarge && showFilters && <FilterElements table={table} />}
      </Flex>
      <Flex align="center" className="w-auto">
        {/*<Button
          {...(!isLarge
            ? {
                onClick: () => {
                  setOpenDrawer(() => !openDrawer);
                },
              }
            : { onClick: () => setShowFilters(() => !showFilters) })}
          variant={'outline'}
          className={cn(
            'h-[34px] pe-3 ps-2.5',
            isLarge && showFilters && 'border-dashed border-gray-700'
          )}
        >
          <Image
            src={'/Filter.svg'}
            alt="Users icon"
            width={18}
            height={18}
            className="me-1.5"
          />
          {'Szűrők'}
        </Button>*/}

        {!isLarge && (
          <FilterDrawerView
            drawerTitle="Table Filters"
            isOpen={openDrawer}
            setOpenDrawer={setOpenDrawer}
          >
            <div className="grid grid-cols-1 gap-6">
              <FilterElements table={table} />
            </div>
          </FilterDrawerView>
        )}

        <ToggleColumns table={table} />
      </Flex>
    </Flex>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
}: TableToolbarProps<T>) {
  const priceFieldValue = (table.getColumn('amount')?.getFilterValue() ?? [
    '',
    '',
  ]) as string[];
  const createdDate =
    table.getColumn('createdAt')?.getFilterValue() ?? ([null, null] as any);
  const dueDate =
    table.getColumn('dueDate')?.getFilterValue() ?? ([null, null] as any);
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;
  return (
    <>
      <PriceField
        value={priceFieldValue}
        onChange={(v) => table.getColumn('amount')?.setFilterValue(v)}
      />
      <DateFiled
        selectsRange
        dateFormat={'dd-MMM-yyyy'}
        className="w-full"
        placeholderText="Select created date"
        endDate={getDateRangeStateValues(createdDate[1])!}
        selected={getDateRangeStateValues(createdDate[0])}
        startDate={getDateRangeStateValues(createdDate[0])!}
        onChange={(date) => table.getColumn('createdAt')?.setFilterValue(date)}
        inputProps={{
          label: 'Created Date',
          labelClassName: '3xl:hidden',
        }}
      />
      <DateFiled
        selectsRange
        dateFormat={'dd-MMM-yyyy'}
        className="w-full"
        placeholderText="Select due date"
        endDate={getDateRangeStateValues(dueDate[1])!}
        selected={getDateRangeStateValues(dueDate[0])}
        startDate={getDateRangeStateValues(dueDate[0])!}
        onChange={(date) => table.getColumn('dueDate')?.setFilterValue(date)}
        inputProps={{
          label: 'Due Date',
          labelClassName: '3xl:hidden',
        }}
      />
      <StatusField
        options={statusOptions}
        value={table.getColumn('status')?.getFilterValue() ?? []}
        onChange={(e) => table.getColumn('status')?.setFilterValue(e)}
        getOptionValue={(option: { value: any }) => option.value}
        getOptionDisplayValue={(option: { value: any }) =>
          renderOptionDisplayValue(option.value as string)
        }
        displayValue={(selected: string) => renderOptionDisplayValue(selected)}
        dropdownClassName="!z-20 h-auto"
        className={'w-auto'}
        label="Status"
        labelClassName="3xl:hidden"
      />

      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            table.resetGlobalFilter();
            table.resetColumnFilters();
          }}
          variant="flat"
          className="h-9 bg-gray-200/70"
        >
          <PiTrashDuotone className="me-1.5 size-[17px]" /> Clear
        </Button>
      )}
    </>
  );
}
