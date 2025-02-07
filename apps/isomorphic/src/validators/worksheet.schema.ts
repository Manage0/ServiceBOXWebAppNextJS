import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// Regular expressions for Hungarian and EU tax numbers
const HUNGARIAN_TAX_NUMBER_REGEX = /^\d{8}-\d-\d{2}$/;
const EU_TAX_NUMBER_REGEX = /^[A-Z]{2}\d{8,}$/;
const HUNGARIAN_POSTAL_CODE_REGEX = /^\d{4}$/;

//tbh kéne egy type csak a form submissionnek és egy csak a worksheetnek

// Form Zod validation schema
export const WorksheetFormSchema = z
  .object({
    completion_date: z.date({ required_error: 'A befejezés dátuma kötelező.' }),
    start_time: z.string().optional(),
    arrival_time: z.string().optional(),
    departure_time: z.string().optional(),
    rearrival_time: z.string().optional(),
    go_time: z.string().optional(),
    handover_date: z.date({ required_error: 'Az átadás dátuma kötelező.' }),
    priority: z.enum(['weakest', 'weak', 'normal', 'strong', 'strongest'], {
      required_error: 'A prioritás megadása kötelező.',
      invalid_type_error: 'Érvénytelen prioritás érték.',
    }),
    site_id: z.number({ required_error: 'Telephely kiválasztása kötelező.' }),
    partner_id: z.number({ required_error: 'Partner kiválasztása kötelező.' }),
    netto_price: z.number().optional(),
    total_price: z.number().optional(),
    creation_date: z
      .date({ required_error: 'A létrehozás dátuma kötelező.' })
      .optional(),
    status: z.enum(
      ['new', 'pending', 'completed', 'outforsignature', 'draft', 'closed'],
      {
        required_error: 'A státusz megadása kötelező.',
        invalid_type_error: 'Érvénytelen státusz érték.',
      }
    ),
    invoice_date: z.date({ required_error: 'A számla dátuma kötelező.' }),
    signage: z.any().optional(),
    signage_date: z.date().optional(),
    deadline_date: z.date({ required_error: 'A határidő dátuma kötelező.' }),
    id: z
      .string({ required_error: 'Az azonosító megadása kötelező.' })
      .optional(),
    signing_person: z.string().optional(),
    received_accessories: z.string().optional(),
    jira_ticket_num: z.string().optional(),
    invoice_number: z.string().optional(),
    procurement_po: z.string().optional(),
    partner_name: z.string().optional(),
    country: z.string({ required_error: 'Az ország megadása kötelező.' }),
    postal_code: z
      .string({ required_error: 'Az irányítószám megadása kötelező.' })
      .refine((val) => HUNGARIAN_POSTAL_CODE_REGEX.test(val), {
        message:
          'Érvénytelen irányítószám formátum. Magyar (xxxx) formátum szükséges.',
      }),
    city: z.string({ required_error: 'A város megadása kötelező.' }),
    address: z.string({ required_error: 'A cím megadása kötelező.' }),
    tax_num: z.string({ required_error: 'Az adószám megadása kötelező.' }),
    email: validateEmail,
    issue_description: z.string().optional(),
    work_description: z.string().optional(),
    public_comment: z.string().optional(),
    private_comment: z.string().optional(),
    company_name: z.string().nullable().optional(),
    company_address: z.string().nullable().optional(),
    company_tax_num: z.string().nullable().optional(),
    badge: z.string().optional(),
    creator_name: z.string().nullable().optional(),
    worksheet_id: z.string({
      required_error: 'A munkalap azonosító megadása kötelező.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.tax_num) {
      if (
        data.country === 'HU' &&
        !HUNGARIAN_TAX_NUMBER_REGEX.test(data.tax_num as string)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tax_num'],
          message:
            'Érvénytelen adószám formátum. Magyar (xxxxxxxx-x-xx) formátum szükséges.',
        });
      } else if (
        data.country !== 'HU' &&
        !EU_TAX_NUMBER_REGEX.test(data.tax_num as string)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tax_num'],
          message:
            'Érvénytelen adószám formátum. EU (országkód + xxxxxxxx) formátum szükséges.',
        });
      }
    }
  });

// Generate form types from Zod validation schema
export type WorksheetFormTypes = z.infer<typeof WorksheetFormSchema>;

export const defaultValues: WorksheetFormTypes = {
  completion_date: new Date(),
  start_time: '',
  arrival_time: '',
  departure_time: '',
  rearrival_time: '',
  handover_date: new Date(),
  priority: 'normal',
  site_id: 1,
  partner_id: 1,
  netto_price: undefined,
  total_price: undefined,
  creation_date: new Date(),
  status: 'new',
  invoice_date: new Date(),
  signage: undefined,
  signage_date: new Date(),
  deadline_date: new Date(),
  id: '',
  signing_person: '',
  received_accessories: '',
  jira_ticket_num: '',
  invoice_number: '',
  procurement_po: '',
  partner_name: '',
  country: '',
  postal_code: '',
  city: '',
  address: '',
  tax_num: '',
  email: '',
  issue_description: '',
  work_description: '',
  public_comment: '',
  private_comment: '',
  company_name: '',
  company_address: '',
  company_tax_num: '',
  badge: '',
  creator_name: '',
  worksheet_id: '',
};
