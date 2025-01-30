import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// Regular expressions for Hungarian and EU tax numbers
const HUNGARIAN_TAX_NUMBER_REGEX = /^\d{8}-\d-\d{2}$/;
const EU_TAX_NUMBER_REGEX = /^[A-Z]{2}\d{8,}$/;

// Form Zod validation schema
export const WorksheetFormSchema = z
  .object({
    completion_date: z.string().optional(),
    start_time: z.string().optional(),
    arrival_time: z.string().optional(),
    departure_time: z.string().optional(),
    rearrrival_time: z.string().optional(),
    handover_date: z.string().optional(),
    priority: z.enum(['normal', 'high', 'low']),
    site_id: z.number().optional(),
    partner_id: z.number().optional(),
    netto_price: z.number().optional(),
    total_price: z.number().optional(),
    creation_date: z.string(),
    status: z.enum(['new', 'in_progress', 'completed', 'cancelled']),
    invoice_date: z.string().optional(),
    signage: z.any().optional(),
    signage_date: z.string().optional(),
    deadline_date: z.string().optional(),
    id: z.string(),
    signing_person: z.string().optional(),
    received_accessories: z.string().optional(),
    jira_ticket_num: z.string().optional(),
    invoice_number: z.string().optional(),
    procurement_po: z.string().optional(),
    partner_name: z.string(),
    country: z.string(),
    postal_code: z.string(),
    city: z.string(),
    address: z.string(),
    tax_num: z.string(),
    email: validateEmail,
    issue_description: z.string().optional(),
    work_description: z.string().optional(),
    public_comment: z.string().optional(),
    private_comment: z.string().optional(),
    company_name: z.string(),
    company_address: z.string(),
    company_tax_num: z.string(),
    badge: z.string().optional(),
    creator_name: z.string(),
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
  completion_date: '',
  start_time: '',
  arrival_time: '',
  departure_time: '',
  rearrrival_time: '',
  handover_date: '',
  priority: 'normal',
  site_id: undefined,
  partner_id: undefined,
  netto_price: undefined,
  total_price: undefined,
  creation_date: '',
  status: 'new',
  invoice_date: '',
  signage: undefined,
  signage_date: '',
  deadline_date: '',
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
