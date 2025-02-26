import { Controller } from 'react-hook-form';
import { Select, SelectOption } from 'rizzui';
import { renderOptionDisplayValue } from '../invoice/form-utils';

interface ControlledSelectProps {
  name: string;
  control: any;
  label: string;
  options: SelectOption[];
  error?: string;
  isMulti?: boolean; // Add isMulti prop to support multiple selection
  disabled?: boolean;
}

const ControlledSelect = ({
  name,
  control,
  label,
  options,
  error,
  isMulti = false, // Default to single selection
  disabled = false,
}: ControlledSelectProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { name, onChange, value } }) => (
      <Select
        disabled={disabled}
        placeholder=""
        dropdownClassName="!z-10 h-auto"
        inPortal={false}
        options={options}
        defaultValue={isMulti ? [] : undefined} // Default value for multiple selection
        value={isMulti && !Array.isArray(value) ? [] : value} // Ensure value is an array for multiple selection
        onChange={(selected) => {
          if (isMulti) {
            onChange((selected as string[]).map((option: string) => option));
          } else {
            onChange(selected);
          }
        }}
        name={name}
        label={label}
        error={error}
        multiple={isMulti} // Enable multiple selection
        getOptionValue={(option) => option.value}
        getOptionDisplayValue={(option) => {
          const isSelected = isMulti
            ? (value as string[]).includes(option.value as string)
            : value === option.value;
          return renderOptionDisplayValue(option.label as string, isSelected);
        }}
        displayValue={(selected: string | string[]) => {
          if (Array.isArray(selected)) {
            return selected
              .map((value) => {
                const selectedOption = options.find(
                  (option) => option.value === value
                );
                return selectedOption ? selectedOption.label : '';
              })
              .join(', ');
          } else {
            const selectedOption = options.find(
              (option) => option.value === selected
            );
            return selectedOption
              ? renderOptionDisplayValue(selectedOption.label as string)
              : '';
          }
        }}
      />
    )}
  />
);

export default ControlledSelect;
