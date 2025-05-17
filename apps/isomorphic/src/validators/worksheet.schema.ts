import { z } from 'zod';
import { validateEmail } from './common-rules';

// Regular expressions for Hungarian and EU tax numbers
const HUNGARIAN_TAX_NUMBER_REGEX = /^\d{8}-\d-\d{2}$/;
const EU_TAX_NUMBER_REGEX = /^[A-Z]{2}\d{8,}$/;
const HUNGARIAN_POSTAL_CODE_REGEX = /^\d{4}$/;

// Form Zod validation schema
export const WorksheetFormSchema = z.object({
  devices: z
    .array(
      z.object({
        name: z.string().min(1),
        device_id: z.string().min(1),
      })
    )
    .optional(),
  completion_date: z.union([z.date(), z.undefined()]),
  start_time: z.union([z.string(), z.undefined()]),
  arrival_time: z.union([z.string(), z.undefined()]),
  departure_time: z.union([z.string(), z.undefined()]),
  rearrival_time: z.union([z.string(), z.undefined()]),
  go_time: z.union([z.string(), z.undefined()]),
  handover_date: z.union([z.date(), z.undefined()]),
  priority: z.enum(['weakest', 'weak', 'normal', 'strong', 'strongest']),
  site_id: z.number().optional(),
  partner_id: z.number(),
  status: z.enum([
    'new',
    'pending',
    'completed',
    'outforsignature',
    'draft',
    'closed',
  ]),
  invoice_date: z.union([z.date(), z.undefined()]),
  signage: z.any(),
  deadline_date: z.union([z.date(), z.undefined()]),
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
  badge: z.string(),
  creator_name: z.string(),
  worksheet_id: z.string(),
  assignees: z.array(z.string()).optional(),
  connected_worksheet_ids: z.array(z.number()).optional(),
  products: z
    .array(
      z.object({
        id: z.number(),
        product_name: z.string(),
        amount: z.number(),
        measure: z.string(),
        private_comment: z.string(),
        public_comment: z.string(),
      })
    )
    .optional(),
});

// Generate form types from Zod validation schema
export type WorksheetFormTypesREALLYFORTHEFORM = z.infer<
  typeof WorksheetFormSchema
>;

// Generate form types from Zod validation schema
export type WorksheetFormTypes = z.infer<typeof WorksheetFormSchema> & {
  creation_date: Date;
  signange_date: Date;
  id: string;
  signing_person: string;
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrow2 = new Date();
tomorrow2.setDate(tomorrow.getDate() + 2);

const tomorrow3 = new Date();
tomorrow3.setDate(tomorrow.getDate() + 3);

export const defaultValues: WorksheetFormTypes = {
  completion_date: tomorrow2,
  start_time: '13:00',
  arrival_time: '14:00',
  departure_time: '16:00',
  rearrival_time: '17:00',
  handover_date: tomorrow2,
  priority: 'normal',
  site_id: undefined,
  partner_id: 1,
  status: 'new',
  invoice_date: new Date(),
  signage: undefined,
  deadline_date: tomorrow3,
  creation_date: new Date(),
  signange_date: new Date(),
  id: '',
  signing_person: '',
  received_accessories:
    'A mérőórához tartozó kiegészítőket, mint például a csavarok és a kábelek, átadtuk.',
  jira_ticket_num: '',
  invoice_number: 'SZ-1234',
  procurement_po: '',
  partner_name: '',
  country: '',
  postal_code: '',
  city: '',
  address: '',
  tax_num: '',
  email: '',
  issue_description: 'A mérőóra nem működik',
  work_description: 'Kicseréltük a mérőórát',
  public_comment: 'Nagyon nehéz volt kicserélni a mérőórát',
  private_comment: 'Az eredeti mérőóra javítható',
  company_name: '',
  company_address: '',
  company_tax_num: '',
  badge: '',
  creator_name: '',
  worksheet_id: '',
  assignees: [],
  connected_worksheet_ids: [],
  products: undefined,
  devices: undefined,
  go_time: '',
};
