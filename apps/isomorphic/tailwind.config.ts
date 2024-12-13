import type { Config } from 'tailwindcss';
import sharedConfig from 'tailwind-config';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Pick<Config, 'prefix' | 'presets' | 'content' | 'theme'> = {
  content: [
    './src/**/*.tsx',
    './node_modules/rizzui/dist/*.{js,ts,jsx,tsx}',
    '../../packages/isomorphic-core/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', ...fontFamily.sans],
        lexendDeca: ['var(--font-lexend-deca)', ...fontFamily.sans],
        lexendBold: ['var(--font-lexend-bold)', ...fontFamily.sans],
      },
      colors: {
        'custom-green': '#0B9488',
      },
    },
  },
  presets: [sharedConfig],
};

export default config;
