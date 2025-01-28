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

export default function CompanyInfoView() {
  const [defaultValues, setDefaultValues] = useState<CompanyFormTypes | null>(
    null
  );

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await fetch('/api/company');
        if (!res.ok) {
          throw new Error('Failed to fetch company data');
        }
        const data: CompanyFormTypes = (await res.json()) as CompanyFormTypes;
        setDefaultValues(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast.error('Hiba történt a cégadatok betöltésekor.');
      }
    };

    fetchCompanyData();
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

  const countryOptions = [
    { value: 'HU', label: 'Magyarország' },
    { value: 'EU', label: 'EU' },
    // Add other countries as needed
  ];

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
                <LabeledInput>
                  <Label>Cég neve</Label>
                  <Input
                    {...register('company_name')}
                    error={errors.company_name?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Ország</Label>
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <Select
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
                </LabeledInput>
                <LabeledInput>
                  <Label>Irányítószám</Label>
                  <Input
                    {...register('postal_code')}
                    error={errors.postal_code?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Település</Label>
                  <Input
                    {...register('city')}
                    error={errors.city?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Cím</Label>
                  <Input
                    {...register('address')}
                    error={errors.address?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>Adószám</Label>
                  <Input
                    {...register('tax_number')}
                    error={errors.tax_number?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>EU Adószám</Label>
                  <Input
                    {...register('eu_tax_number')}
                    error={errors.eu_tax_number?.message}
                    className="flex-grow"
                  />
                </LabeledInput>
                <LabeledInput>
                  <Label>E-mail</Label>
                  <Input
                    {...register('email')}
                    error={errors.email?.message}
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
