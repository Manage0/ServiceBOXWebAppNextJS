'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Loader, Text, Input } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import {
  companyFormSchema,
  CompanyFormTypes,
} from '@/validators/company-info.schema';
import { useEffect, useState } from 'react';
import { countryOptions } from '../options';
import { fetchCompanyData } from '@/utils';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Loader variant="spinner" />
    </div>
  ),
});

export default function CompanyInfoView() {
  const [defaultValues, setDefaultValues] = useState<CompanyFormTypes | null>(
    null
  );

  useEffect(() => {
    fetchCompanyData(setDefaultValues);
  }, []);

  const onSubmit: SubmitHandler<CompanyFormTypes> = async (data) => {
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(<Text as="b">Cégadatok sikeresen megváltoztatva!</Text>);
        console.log('Profile settings data ->', data);
      } else {
        const errorData = (await res.json()) as { error: string };
        toast.error(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating company data:', error);
      toast.error('Hiba történt a cégadatok frissítésekor.');
    }
  };

  if (!defaultValues) {
    return (
      <div className="grid h-10 place-content-center">
        <Loader variant="spinner" />
      </div>
    );
  }

  return (
    <Form<CompanyFormTypes>
      validationSchema={companyFormSchema}
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
                title="Cégadatok"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  label="Cég neve"
                  {...register('company_name')}
                  error={errors.company_name?.message}
                  className="flex-grow"
                />
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <Select
                      label="Ország"
                      {...field}
                      options={countryOptions}
                      value={countryOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption: { value: string } | null) =>
                        field.onChange(selectedOption?.value)
                      }
                      error={errors.country?.message}
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
                  label="Adószám"
                  {...register('tax_number')}
                  error={errors.tax_number?.message}
                  className="flex-grow"
                />
                <Input
                  label="EU Adószám"
                  {...register('eu_tax_number')}
                  error={errors.eu_tax_number?.message}
                  className="flex-grow"
                />
                <Input
                  label="E-mail"
                  {...register('email')}
                  error={errors.email?.message}
                  className="flex-grow"
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
