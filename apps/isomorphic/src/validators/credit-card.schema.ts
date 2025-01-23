import { z } from 'zod';

// form zod validation schema
export const creditCardSchema = z.object({
  cardHolder: z.string().min(1),
  cardNumber: z.string().min(10),
  expiryDate: z.string().min(1),
  cvc: z.string().length(3),
});

// generate form types from zod validation schema
export type CreditCardSchema = z.infer<typeof creditCardSchema>;
