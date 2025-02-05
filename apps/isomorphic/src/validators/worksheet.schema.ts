import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// Regular expressions for Hungarian and EU tax numbers
const HUNGARIAN_TAX_NUMBER_REGEX = /^\d{8}-\d-\d{2}$/;
const EU_TAX_NUMBER_REGEX = /^[A-Z]{2}\d{8,}$/;
const HUNGARIAN_POSTAL_CODE_REGEX = /^\d{4}$/;

// Form Zod validation schema
export const WorksheetFormSchema = z
  .object({
    completion_date: z.date(),
    start_time: z.string().optional(),
    arrival_time: z.string().optional(),
    departure_time: z.string().optional(),
    rearrival_time: z.string().optional(),
    go_time: z.string().optional(),
    handover_date: z.date(),
    priority: z.enum(['weakest', 'weak', 'normal', 'strong', 'strongest']),
    site_id: z.number().optional(),
    partner_id: z.number().optional(),
    netto_price: z.number().optional(),
    total_price: z.number().optional(),
    creation_date: z.date(),
    status: z.enum([
      'new',
      'pending',
      'completed',
      'outforsignature',
      'draft',
      'closed',
    ]),
    invoice_date: z.date(),
    signage: z.any().optional(),
    signage_date: z.date(),
    deadline_date: z.date(),
    id: z.string(),
    signing_person: z.string().optional(),
    received_accessories: z.string().optional(),
    jira_ticket_num: z.string().optional(),
    invoice_number: z.string().optional(),
    procurement_po: z.string().optional(),
    partner_name: z.string().optional(),
    country: z.string(),
    postal_code: z
      .string()
      .refine((val) => HUNGARIAN_POSTAL_CODE_REGEX.test(val), {
        message:
          'Érvénytelen irányítószám formátum. Magyar (xxxx) formátum szükséges.',
      }),
    city: z.string(),
    address: z.string(),
    tax_num: z.string(),
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
    worksheet_id: z.string(),
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
  site_id: undefined,
  partner_id: undefined,
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
