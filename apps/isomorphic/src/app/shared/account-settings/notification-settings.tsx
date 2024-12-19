'use client';

import { useState } from 'react';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';
import { Button, Text } from 'rizzui';

const generalOptions = [
  {
    title: 'Munkalap megnyitás',
  },
  {
    title: 'Munkalap aláírása',
  },
  {
    title: 'Munkalap státusz változás',
  },
];

export default function NotificationSettingsView() {
  const [values, setValues] = useState<string[]>([]);
  const [value, setValue] = useState('');

  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Értesítések"
        titleClassName="text-xl font-semibold"
        description="Válaszd ki hogyan és hol szeretnél értesítést kapni"
      />
      <HorizontalFormBlockWrapper
        title="Általános értesítések"
        description="Válaszd ki ahol kéred"
        descriptionClassName="max-w-[344px]"
      >
        <div className="col-span-2">
          {generalOptions.map((opt, index) => (
            <div
              key={`generalopt-${index}`}
              className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0"
            >
              <Text className="text-sm font-medium text-gray-900">
                {opt.title}
              </Text>
              <ButtonGroup
                onChange={(option) => console.log(opt.title, option)}
              />
            </div>
          ))}
        </div>
      </HorizontalFormBlockWrapper>
    </div>
  );
}

const options = ['None', 'In-app', 'Email'];

function ButtonGroup({ onChange }: { onChange: (option: string) => void }) {
  const [selected, setSelected] = useState<string>();
  function handleOnClick(option: string) {
    setSelected(option);
    onChange && onChange(option);
  }

  return (
    <div className="inline-flex gap-1">
      {options.map((option) => (
        <Button
          key={option}
          variant={selected === option ? 'solid' : 'outline'}
          onClick={() => handleOnClick(option)}
          disabled={'In-app' === option}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
