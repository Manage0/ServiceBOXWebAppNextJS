'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@core/ui/form';
import { Loader, Text, Input, SelectOption } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/validators/personal-info.schema';
import AvatarUpload from '@core/ui/file-upload/avatar-upload';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { CoworkersTableDataType } from '../coworkers/dashboard/coworkers-table/coworkersTable';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Loader variant="spinner" />
    </div>
  ),
});

export const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-left font-inter text-sm font-normal tracking-normal text-[#25282B] opacity-100">
    {children}
  </div>
);

export const LabeledInput = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">{children}</div>
);

export default function PersonalInfoView() {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [user, setUser] = useState<CoworkersTableDataType | undefined>(
    undefined
  );

  async function getUser() {
    try {
      const session = await getSession();
      const userId = session?.user?.id;

      const res = await fetch('/api/usersOnlyMe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }), // Send user_id in the request body
      });

      if (res.ok) {
        const data: CoworkersTableDataType =
          (await res.json()) as CoworkersTableDataType;
        setUser(data);
      } else {
        console.error('Failed to fetch roles:', await res.json());
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = async (data) => {
    try {
      toast.success(<Text as="b">Éppen elmentjük az adataid...</Text>);
      console.log('Profile settings data ->', {
        ...data,
      });

      const url = '/api/auth/updateUser';
      const method = 'PUT';

      const session = await getSession();
      const userId = session?.user?.id;

      // Call the API to update the user data
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          email: data.email,
          role_id: data.role,
          surname: data.last_name,
          forename: data.first_name,
          profile_picture: data.avatar, // Pass the base64 avatar
        }),
      });

      if (res.ok) {
        await getUser();
        toast.success(
          <Text as="b" className="font-semibold">
            A profil adataid sikeresen frissítve lettek!
          </Text>
        );
      } else {
        const errorData = (await res.json()) as { error: string };
        toast.error(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Hiba történt a profil frissítésekor.');
    }
  };

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

  if (!user) {
    return <div>Betöltés...</div>;
  }
  return (
    <Form<PersonalInfoFormTypes>
      validationSchema={personalInfoFormSchema}
      // resetValues={reset}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: 'onChange',
        defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        // Key mapping to align CoworkersTableDataType keys with PersonalInfoFormTypes keys
        const keyMapping: Record<
          keyof CoworkersTableDataType,
          keyof PersonalInfoFormTypes | undefined
        > = {
          forename: 'first_name',
          surname: 'last_name',
          email: 'email',
          role_name: 'role',
          profile_picture: 'avatar',
          id: undefined,
          last_login: undefined,
          last_activity: undefined,
        };

        if (user) {
          (Object.keys(user) as (keyof CoworkersTableDataType)[]).forEach(
            (key) => {
              const formKey = keyMapping[key]; // Map the key
              if (formKey) {
                setValue(
                  formKey,
                  user[key] as PersonalInfoFormTypes[typeof formKey]
                );
              }
            }
          );
        }

        if (user?.role_name) {
          const matchingRole = roles.find(
            (role) => role.label === user.role_name
          );
          if (matchingRole?.value) {
            setValue('role', Number(matchingRole.value)); // Set the numeric value
          }
        }
        return (
          <>
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Személyes adatok"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <LabeledInput>
                  <Label>Vezetéknév</Label>
                  <Input
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Keresztnév</Label>
                  <Input
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Profilkép</Label>
                  <div className="flex flex-col gap-6 @container @3xl:col-span-2">
                    <AvatarUpload
                      name="avatar"
                      setValue={setValue}
                      getValues={getValues}
                      error={errors?.avatar?.message as string}
                    />
                  </div>
                </LabeledInput>
              </FormGroup>

              <FormGroup
                title="Email cím"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </FormGroup>
              <FormGroup
                title="Szerepkör"
                className="mb-20 pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { value, onChange, ref } }) => (
                    <Select
                      ref={ref} // Pass the ref for proper integration with react-hook-form
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={roles}
                      onChange={(selectedOption: Number) => {
                        onChange(selectedOption); // Update the form state with the numeric value
                      }}
                      value={roles.find((role) => role.value === value) || null} // Ensure the correct option is selected
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      error={errors?.role?.message as string}
                    />
                  )}
                />
              </FormGroup>
            </div>
            <FormFooter altBtnText="Mégsem" submitBtnText="Mentés" />
          </>
        );
      }}
    </Form>
  );
}
