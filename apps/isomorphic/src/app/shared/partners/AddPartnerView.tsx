'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Loader, Text, Input } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import { useState, useEffect } from 'react';
import cn from '@core/utils/class-names';
import DeletePopover from '@core/components/delete-popover';
import AddBtn from '../add-btn';
import {
  PartnerFormTypes,
  PartnerFormSchema,
  defaultValues,
} from '@/validators/partner.schema';
import countryOptions from '../countryOptions';

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

export type PartnerDataWithId = PartnerFormTypes & {
  id: string;
  emails?: string[];
  site?: {
    name: string;
    external_id: string;
    country: string;
    postal_code: string;
    city: string;
    address: string;
  };
};

export default function AddPartnerView({
  partnerData,
}: {
  partnerData?: PartnerDataWithId;
}) {
  const [emails, setEmails] = useState<string[]>(partnerData?.emails || []);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    partnerData?.country || defaultValues.country
  );

  useEffect(() => {
    if (partnerData) {
      setEmails(partnerData.emails || []);
      setSelectedCountry(partnerData.country || '');
    }
  }, [partnerData]);

  const onSubmit: SubmitHandler<PartnerFormTypes> = async (data) => {
    console.log('Form data:', data); // Log the form data

    try {
      const method = partnerData ? 'PUT' : 'POST';
      const url = '/api/partners';
      const {
        site_name,
        site_external_id,
        site_country,
        site_postal_code,
        site_city,
        site_address,
        ...rest
      } = data;

      const payload = {
        ...rest,
        id: partnerData?.id,
        emails,
        site: {
          name: site_name,
          external_id: site_external_id,
          country: site_country,
          postal_code: site_postal_code,
          city: site_city,
          address: site_address,
        },
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          <Text as="b">
            Partner sikeresen {partnerData ? 'frissítve' : 'hozzáadva'}
          </Text>
        );
        console.log('Partner data ->', payload);
        if (partnerData) {
          // Reload the page to reflect the changes
          window.location.reload();
        }
      } else {
        const errorData = (await res.json()) as { error: string };
        toast.error(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting partner:', error);
      toast.error('Hiba történt a partner hozzáadásakor.');
    }
  };

  return (
    <Form<PartnerFormTypes>
      validationSchema={PartnerFormSchema}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: 'onChange',
        defaultValues: partnerData || defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        if (partnerData) {
          Object.keys(partnerData).forEach((key) => {
            setValue(
              key as keyof PartnerFormTypes,
              partnerData[key as keyof PartnerFormTypes]
            );
          });
          if (partnerData.site) {
            setValue('site_name', partnerData.site.name);
            setValue('site_external_id', partnerData.site.external_id);
            setValue('site_country', partnerData.site.country);
            setValue('site_postal_code', partnerData.site.postal_code);
            setValue('site_city', partnerData.site.city);
            setValue('site_address', partnerData.site.address);
          }
        }

        return (
          <>
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Partner adatok"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  label="Partner neve"
                  {...register('name')}
                  error={errors.name?.message}
                  className="flex-grow"
                />
                <Input
                  label="Partner külső ID"
                  {...register('external_id')}
                  error={errors.external_id?.message}
                  className="flex-grow"
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Ország"
                      options={countryOptions}
                      onChange={(option: { value: string }) => {
                        field.onChange(option.value);
                        setSelectedCountry(option.value || '');
                      }}
                      placeholder=""
                      className="flex-grow"
                    />
                  )}
                />
                <Input
                  label="Irányítószám"
                  {...register('postal_code')}
                  error={errors.postal_code?.message}
                  className="flex-grow"
                />
                <Input
                  label="Település"
                  {...register('city')}
                  error={errors.city?.message}
                  className="flex-grow"
                />
                <Input
                  label="Cím"
                  {...register('address')}
                  error={errors.address?.message}
                  className="flex-grow"
                />

                <Input
                  label={selectedCountry === 'HU' ? 'Adószám' : 'EU adószám'}
                  {...register('tax_num')}
                  error={errors.tax_num?.message}
                  className="flex-grow"
                />
              </FormGroup>
              <FormGroup
                title="Telephely"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  label="Telephely neve"
                  {...register('site_name')}
                  error={errors.site_name?.message}
                  className="flex-grow"
                />
                <Input
                  label="Partner külső ID (Telephely)"
                  {...register('site_external_id')}
                  error={errors.site_external_id?.message}
                  className="flex-grow"
                />
                <Controller
                  name="site_country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Ország"
                      options={countryOptions}
                      onChange={(option: { value: string }) => {
                        field.onChange(option.value);
                        setSelectedCountry(option.value || '');
                      }}
                      placeholder=""
                      className="flex-grow"
                    />
                  )}
                />
                <Input
                  label="Irányítószám"
                  {...register('site_postal_code')}
                  error={errors.site_postal_code?.message}
                  className="flex-grow"
                />
                <Input
                  label="Település"
                  {...register('site_city')}
                  error={errors.site_city?.message}
                  className="flex-grow"
                />
                <Input
                  label="Cím"
                  {...register('site_address')}
                  error={errors.site_address?.message}
                  className="flex-grow"
                />
              </FormGroup>
              <FormGroup
                title="Központi elérhetőségek"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  label="Kapcsolattartó neve"
                  {...register('contact_person')}
                  error={errors.contact_person?.message}
                  className="flex-grow"
                />
                <Input
                  label="Kapcsolattartó telefonszám"
                  {...register('contact_phone_number')}
                  error={errors.contact_phone_number?.message}
                  className="flex-grow"
                />
                <div className="flex flex-col gap-4">
                  <Input
                    label="E-mail"
                    {...register('email')}
                    error={errors.email?.message}
                    className="flex-grow"
                  />
                  {emails.map((email, index) => (
                    <div
                      className="flex flex-row items-center gap-4"
                      key={index}
                    >
                      <Input
                        label={index + 2 + '. E-mail'}
                        value={email}
                        error={errors.email?.message}
                        className="flex-grow"
                        onChange={(e) => {
                          const newEmails = [...emails];
                          newEmails[index] = e.target.value;
                          setEmails(newEmails);
                        }}
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
                  ))}
                  <AddBtn
                    onClick={() => setEmails([...emails, ''])}
                    variant="gray"
                  />
                </div>
              </FormGroup>
              {/*<FormGroup
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
              </FormGroup>*/}
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
