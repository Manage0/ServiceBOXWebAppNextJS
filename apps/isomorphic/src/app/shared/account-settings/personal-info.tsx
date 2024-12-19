'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiClock, PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@core/ui/form';
import { Loader, Text, Input } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/validators/personal-info.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';
import { countries, roles, timezones } from '@/data/forms/my-details';
import AvatarUpload from '@core/ui/file-upload/avatar-upload';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Loader variant="spinner" />
    </div>
  ),
});

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
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
  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = (data) => {
    toast.success(<Text as="b">Successfully added!</Text>);
    console.log('Profile settings data ->', {
      ...data,
    });
  };

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
                    placeholder="First Name"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Keresztnév</Label>
                  <Input
                    placeholder="Last Name"
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
                  placeholder="georgia.young@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </FormGroup>
              <FormGroup
                title="Jogosultság"
                className="mb-20 pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      placeholder="Select Role"
                      options={roles}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        roles?.find((r) => r.value === selected)?.label ?? ''
                      }
                      error={errors?.role?.message as string}
                    />
                  )}
                />
              </FormGroup>
            </div>
            <FormFooter
              // isLoading={isLoading}
              altBtnText="Mégsem"
              submitBtnText="Mentés"
            />
          </>
        );
      }}
    </Form>
  );
}
