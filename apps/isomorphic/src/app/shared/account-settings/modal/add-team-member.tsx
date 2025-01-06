'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Controller, SubmitHandler } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Input, Text, Title, Button, Select } from 'rizzui';
import { Form } from '@core/ui/form';
import {
  AddTeamMemberInput,
  addTeamMemberSchema,
} from '@/validators/team-member.schema';

const role = [
  {
    label: 'Product Designer',
    value: 'product_designer',
  },
  {
    label: 'Software Engineer',
    value: 'software_engineer',
  },
];

export default function AddTeamMemberModalView() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<AddTeamMemberInput> = (data) => {
    toast.success(
      <Text as="b" className="font-semibold">
        Munkatárs sikeresen hozzáadva!
      </Text>
    );
    // set timeout ony required to display loading state of the create product button
    setLoading(true);
    closeModal();
    setTimeout(() => {
      setLoading(false);
      console.log(' data ->', data);
      setReset({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        country: '',
      });
    }, 600);
  };

  return (
    <div className="m-auto p-6">
      <Title as="h3" className="mb-6 text-lg">
        Új Felhasználó Hozzáadása
      </Title>
      <Form<AddTeamMemberInput>
        validationSchema={addTeamMemberSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, control, formState: { errors } }) => (
          <>
            <MemberForm control={control} register={register} errors={errors} />
            <div className="mt-8 flex justify-end gap-3">
              <Button
                className="w-auto"
                variant="outline"
                onClick={() => closeModal()}
              >
                Mégsem
              </Button>
              <Button type="submit" isLoading={isLoading} className="w-auto">
                Hozzáadás
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

export function MemberForm({ register, control, errors }: any) {
  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center">
        <Input
          type="text"
          label="Vezetéknév"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('first_name')}
          error={errors?.first_name?.message}
          className="flex-grow"
        />
        <Input
          type="text"
          label="Keresztnév"
          labelClassName="text-sm font-medium text-gray-900"
          {...register('last_name')}
          error={errors?.last_name?.message}
          className="flex-grow"
        />
      </div>
      <Input
        type="email"
        label="Email"
        labelClassName="text-sm font-medium text-gray-900"
        {...register('email')}
        error={errors.email?.message}
      />
      <Controller
        control={control}
        name="role"
        render={({ field: { value, onChange } }) => (
          <Select
            label="Jogosultság"
            inPortal={false}
            labelClassName="text-sm font-medium text-gray-900"
            dropdownClassName="h-auto"
            placeholder="Válassz..."
            options={role}
            onChange={onChange}
            value={value}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              role?.find((r) => r.value === selected)?.label ?? ''
            }
            error={errors?.role?.message as string}
          />
        )}
      />
    </div>
  );
}
