import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// form zod validation schema
export const addTeamMemberSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameRequired }),
  last_name: z.string().min(1, { message: messages.lastNameRequired }),
  email: validateEmail,
  role: z.number({ required_error: messages.roleIsRequired }),
});

// generate form types from zod validation schema
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
