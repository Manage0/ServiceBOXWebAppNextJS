import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// form zod validation schema
export const signUpSchema = z.object({
  firstName: z.string().min(1, { message: messages.firstNameRequired }),
  lastName: z.string().optional(),
  email: validateEmail,
  isAgreed: z.boolean(),
});

// generate form types from zod validation schema
export type SignUpSchema = z.infer<typeof signUpSchema>;
