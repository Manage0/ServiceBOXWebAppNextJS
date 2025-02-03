import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// Regular expressions for Hungarian and EU tax numbers
const hungarianTaxNumberRegex = /^\d{8}-\d-\d{2}$/;
const euTaxNumberRegex = /^[A-Z]{2}\d{8,}$/;

// form zod validation schema
export const PartnerFormSchema = z
  .object({
    name: z.string().min(1, messages.nameIsRequired),
    external_id: z.string().min(1, messages.externalIDIsRequired),
    email: validateEmail,
    additional_emails: z
      .array(
        z
          .string()
          .refine(
            (email) => validateEmail.safeParse(email).success,
            messages.invalidEmail
          )
      )
      .optional(),
    country: z.string().min(1, messages.countryIsRequired),
    postal_code: z.string().min(1, messages.postalCodeIsRequired),
    city: z.string().min(1, messages.cityIsRequired),
    address: z.string().min(1, messages.addressIsRequired),
    tax_num: z.string().min(1, messages.taxNumIsRequired),
    contact_person: z.string().min(1, messages.contactPersonIsRequired),
    contact_phone_number: z.string().min(1, messages.phoneNumberIsRequired),
    site_name: z.string(),
    site_external_id: z.string(),
    site_country: z.string(),
    site_postal_code: z.string(),
    site_city: z.string(),
    site_address: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.tax_num) {
      if (
        data.country === 'HU' &&
        !hungarianTaxNumberRegex.test(data.tax_num)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tax_num'],
          message:
            'Érvénytelen adószám formátum. Magyar (xxxxxxxx-x-xx) formátum szükséges.',
        });
      } else if (data.country !== 'HU' && !euTaxNumberRegex.test(data.tax_num))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tax_num'],
          message:
            'Érvénytelen adószám formátum. EU (országkód + xxxxxxxx) formátum szükséges.',
        });
    }
  });

// generate form types from zod validation schema
export type PartnerFormTypes = z.infer<typeof PartnerFormSchema>;

export const defaultValues: PartnerFormTypes = {
  name: '',
  external_id: '',
  email: '',
  country: '',
  postal_code: '',
  city: '',
  address: '',
  tax_num: '',
  contact_person: '',
  contact_phone_number: '',
  site_name: '',
  site_external_id: '',
  site_country: '',
  site_postal_code: '',
  site_city: '',
  site_address: '',
  additional_emails: [],
};
