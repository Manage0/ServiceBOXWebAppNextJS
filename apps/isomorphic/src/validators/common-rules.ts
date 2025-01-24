import { z } from 'zod';
import { messages } from '@/config/messages';

export const fileSchema = z.string();

export type FileSchema = z.infer<typeof fileSchema>;

export const validateEmail = z
  .string()
  .min(1, { message: messages.emailIsRequired })
  .email({ message: messages.invalidEmail });
