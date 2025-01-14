'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Controller, SubmitHandler } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Input, Text, Title, Button, Select, SelectOption } from 'rizzui';
import { Form } from '@core/ui/form';
import {
  AddTeamMemberInput,
  addTeamMemberSchema,
} from '@/validators/team-member.schema';

export default function AddTeamMemberModalView() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<AddTeamMemberInput> = async (data) => {
    setLoading(true);
    try {
      // Call the registration API to create the user
      const res = await fetch('/api/auth/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: 'user' + Math.floor(Math.random() * 1000000).toString(),
          email: data.email,
          role_id: data.role,
          surname: data.last_name,
          forename: data.first_name,
        }),
      });

      if (res.ok) {
        // Clear the form after successful submission
        setReset({
          first_name: '',
          last_name: '',
          email: '',
          role: '',
        });
        closeModal();

        // Show success toast
        toast.success(
          <Text as="b" className="font-semibold">
            Munkatárs sikeresen hozzáadva!
          </Text>
        );
      } else {
        const errorData = (await res.json()) as { error: string };
        toast.error(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Hiba történt a munkatárs hozzáadásakor.');
    } finally {
      setLoading(false);
    }
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
  const [roles, setRoles] = useState<SelectOption[]>([]);
  useEffect(() => {
    async function getRoles() {
      try {
        const res = await fetch('/api/auth/roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data: SelectOption[] = (await res.json()) as SelectOption[];
          setRoles(data);
        } else {
          console.error('Failed to fetch roles:', await res.json());
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }
    getRoles();
  }, []);
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
            label="Szerepkör"
            inPortal={false}
            labelClassName="text-sm font-medium text-gray-900"
            dropdownClassName="h-auto"
            placeholder="Válassz..."
            options={roles}
            onChange={onChange}
            value={value}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              roles?.find((r) => r.value === selected)?.label ?? ''
            }
            error={errors?.role?.message as string}
          />
        )}
      />
    </div>
  );
}
