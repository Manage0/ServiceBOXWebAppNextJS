import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// Form Zod validation schema
export const companyFormSchema = z.object({
  company_name: z.string().min(1, { message: messages.companyNameIsRequired }),
  country: z.string().min(1, { message: messages.countryIsRequired }),
  postal_code: z.string().min(1, { message: messages.postalCodeIsRequired }),
  city: z.string().min(1, { message: messages.cityIsRequired }),
  address: z.string().min(1, { message: messages.addressIsRequired }),
  tax_number: z.string().min(1, { message: messages.taxNumIsRequired }),
  eu_tax_number: z.string().optional(), // Optional as not all companies have an EU tax number
  email: validateEmail,
});

// Generate form types from Zod validation schema
export type CompanyFormTypes = z.infer<typeof companyFormSchema>;

export const defaultValues: CompanyFormTypes = {
  company_name: '',
  country: '',
  postal_code: '',
  city: '',
  address: '',
  tax_number: '',
  eu_tax_number: undefined,
  email: '',
};
