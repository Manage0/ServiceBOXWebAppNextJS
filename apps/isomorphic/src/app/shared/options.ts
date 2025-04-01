import { SelectOption } from 'rizzui';

export const countryOptions: SelectOption[] = [
  { value: 'HU', label: 'Magyarország' },
  { value: 'AT', label: 'Ausztria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BG', label: 'Bulgária' },
  { value: 'HR', label: 'Horvátország' },
  { value: 'CY', label: 'Ciprus' },
  { value: 'CZ', label: 'Csehország' },
  { value: 'DK', label: 'Dánia' },
  { value: 'EE', label: 'Észtország' },
  { value: 'FI', label: 'Finnország' },
  { value: 'FR', label: 'Franciaország' },
  { value: 'DE', label: 'Németország' },
  { value: 'GR', label: 'Görögország' },
  { value: 'IE', label: 'Írország' },
  { value: 'IT', label: 'Olaszország' },
  { value: 'LV', label: 'Lettország' },
  { value: 'LT', label: 'Litvánia' },
  { value: 'LU', label: 'Luxemburg' },
  { value: 'MT', label: 'Málta' },
  { value: 'NL', label: 'Hollandia' },
  { value: 'PL', label: 'Lengyelország' },
  { value: 'PT', label: 'Portugália' },
  { value: 'RO', label: 'Románia' },
  { value: 'SK', label: 'Szlovákia' },
  { value: 'SI', label: 'Szlovénia' },
  { value: 'ES', label: 'Spanyolország' },
  { value: 'SE', label: 'Svédország' },
];

export const statusOptions: SelectOption[] = [
  { label: 'Új munkalap', value: 'new' },
  { label: 'Folyamatban', value: 'pending' },
  { label: 'Elkészült', value: 'completed' },
  { label: 'Aláírás alatt', value: 'outforsignature' },
  { label: 'Vázlat', value: 'draft' },
  { label: 'Lezárt', value: 'closed' },
];

export const priorityOptions: SelectOption[] = [
  { label: 'Leggyengébb', value: 'weakest' },
  { label: 'Gyenge', value: 'weak' },
  { label: 'Normál', value: 'normal' },
  { label: 'Erős', value: 'strong' },
  { label: 'Legerősebb', value: 'strongest' },
];
