import { useTheme } from 'next-themes';

export const presetLight = {
  lighter: '#f1f1f1',
  light: '#666666',
  default: '#111111',
  dark: '#000000',
  foreground: '#ffffff',
};

export const presetDark = {
  lighter: '#222222',
  light: '#929292',
  default: '#f1f1f1',
  dark: '#ffffff',
  foreground: '#111111',
};

// defaults from global css line 38
export const DEFAULT_PRESET_COLORS = {
  lighter: '#ccfbf1', // Teal 100
  light: '#5eead4', // Teal 300
  default: '#0d9488', // Teal 600
  dark: '#115e59', // Teal 800
  foreground: '#ffffff',
};

export const DEFAULT_PRESET_COLOR_NAME = 'Teal';

export const usePresets = () => {
  const { theme } = useTheme();

  return [
    {
      name: DEFAULT_PRESET_COLOR_NAME,
      colors: DEFAULT_PRESET_COLORS,
    },
    {
      name: 'Teal',
      colors: {
        lighter: '#ccfbf1', // Teal 100
        light: '#5eead4', // Teal 300
        default: '#0d9488', // Teal 600
        dark: '#115e59', // Teal 800
        foreground: '#ffffff',
      },
    },
  ];
};
