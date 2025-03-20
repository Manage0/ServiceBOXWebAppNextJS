import React from 'react';
import { FormBlockWrapper } from '../invoice/form-utils';
import ControlledSelect from './ControlledSelect';
import { Input } from 'rizzui';
import { countryOptions } from '../options';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { PartnerOption } from '@/types';

interface PartnerSectionProps {
  partnerOptions: PartnerOption[];
  control: any;
  errors: FieldErrors;
  filteredSiteOptions: { label: string; value: number }[];
  register: UseFormRegister<any>;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({
  partnerOptions,
  control,
  errors,
  filteredSiteOptions,
  register,
}) => {
  return (
    <FormBlockWrapper
      title={'Partner adatai'}
      description={'Válaszd ki, hogy kinek szól a bizonylat'}
      className="pt-5"
    >
      <ControlledSelect
        searchable={true}
        options={partnerOptions}
        name="partner_id"
        control={control}
        label="Partner"
        error={errors.partner_id?.message as string}
      />
      <ControlledSelect
        searchable={true}
        options={filteredSiteOptions}
        name="site_id"
        control={control}
        label="Telephely"
        error={errors.site_id?.message as string}
      />
      <Input
        label="Adószám"
        {...register('tax_num')}
        error={errors.tax_num?.message as string}
        disabled
      />
      <Input
        label="Irányítószám"
        {...register('postal_code')}
        error={errors.postal_code?.message as string}
        disabled
      />
      <ControlledSelect
        options={countryOptions}
        name="country"
        control={control}
        label="Ország"
        error={errors.country?.message as string}
        disabled
      />
      <Input
        label="Település"
        {...register('city')}
        error={errors.city?.message as string}
        disabled
      />
      <Input
        label="Cím"
        {...register('address')}
        error={errors.address?.message as string}
        disabled
      />
      <Input
        label="Email"
        {...register('email')}
        error={errors.email?.message as string}
        disabled
      />
    </FormBlockWrapper>
  );
};

export default PartnerSection;
