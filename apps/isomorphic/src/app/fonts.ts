import { Inter, Lexend, Lexend_Deca } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend-deca',
});

export const lexendBold = Lexend({
  subsets: ['latin'],
  weight: '700', // Specify '700' for bold weight
  variable: '--font-lexend-bold',
});
