'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Loader, Text, Input, Button } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/validators/personal-info.schema';
import { useState } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import DeletePopover from '@core/components/delete-popover';
import AddBtn from '../add-btn';

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

export const LabeledInput = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn('flex flex-col gap-4', className)}>{children}</div>;

export default function AddPartnerView() {
  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = (data) => {
    toast.success(<Text as="b">Successfully added!</Text>);
    console.log('Profile settings data ->', {
      ...data,
    });
  };

  //Temporary solution to represent additional emails option
  const [emails, setEmails] = useState<string[]>([]);

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
                title="Partner adatok"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <LabeledInput>
                  <Label>Partner neve</Label>
                  <Input
                    placeholder="Partner neve"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Partner külső ID</Label>
                  <Input
                    placeholder="Partner külső ID"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Ország</Label>
                  <Select
                    options={[
                      {
                        label: 'Magyarország',
                        value: 'HU',
                      },
                    ]}
                    placeholder="Ország"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Irányítószám</Label>
                  <Input
                    placeholder="Irányítószám"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Település</Label>
                  <Input
                    placeholder="Település"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Cím</Label>
                  <Input
                    placeholder="Cím"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Adószám</Label>
                  <Input
                    placeholder="Adószám"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>EU Adószám</Label>
                  <Input
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
              </FormGroup>
              <FormGroup
                title="Telephely"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <LabeledInput>
                  <Label>Telephely neve</Label>
                  <Input
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Partner külső ID (Telephely)</Label>
                  <Input
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Ország</Label>
                  <Select
                    options={[
                      {
                        label: 'Magyarország',
                        value: 'HU',
                      },
                    ]}
                    placeholder="Ország"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Irányítószám</Label>
                  <Input
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Település</Label>
                  <Input
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Cím</Label>
                  <Input
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
              </FormGroup>
              <FormGroup
                title="Központi elérhetőségek"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <LabeledInput>
                  <Label>Kapcsolattartó neve</Label>
                  <Input
                    placeholder="Kapcsolattartó neve"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Kapcsolattartó telefonszám</Label>
                  <Input
                    placeholder="Kapcsolattartó telefonszám"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <div className="flex flex-col gap-4">
                  <LabeledInput>
                    <Label>E-mail</Label>
                    <Input
                      {...register('first_name')}
                      error={errors.first_name?.message}
                      className="flex-grow"
                    />
                  </LabeledInput>
                  {emails.map((email, index) => (
                    <LabeledInput key={index} className="mr-4">
                      {/*TODO honnan az istenből jön az input value-ja? */}
                      <Label>{index + 2}. E-mail</Label>
                      <div className="flex flex-row items-center gap-4">
                        <Input
                          {...register('first_name')}
                          error={errors.first_name?.message}
                          className="flex-grow"
                        />
                        <DeletePopover
                          title={'E-mail törlése'}
                          description={
                            'Biztosan törölni szeretnéd az e-mail címet?'
                          }
                          onDelete={() => {
                            setEmails(emails.filter((_, i) => i !== index));
                          }}
                        />
                      </div>
                    </LabeledInput>
                  ))}
                  <AddBtn onClick={() => setEmails([...emails, ''])} />
                </div>
              </FormGroup>
              <FormGroup
                title="Bizonylat beállítások"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <LabeledInput>
                  <Label>Számla nyelve</Label>
                  <Select
                    options={[
                      {
                        label: 'magyar',
                        value: 'HU',
                      },
                    ]}
                    placeholder="Számla nyelve"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Pénznem</Label>
                  <Select
                    options={[
                      {
                        label: 'Forint',
                        value: 'HU',
                      },
                    ]}
                    placeholder="Pénznem"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
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
