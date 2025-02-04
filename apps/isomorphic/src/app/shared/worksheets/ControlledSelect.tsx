import { Controller } from 'react-hook-form';
import { Select, SelectOption } from 'rizzui';
import { renderOptionDisplayValue } from '../invoice/form-utils';

interface ControlledSelectProps {
  name: string;
  control: any;
  label: string;
  options: SelectOption[];
  error?: string;
}

const ControlledSelect = ({
  name,
  control,
  label,
  options,
  error,
}: ControlledSelectProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { name, onChange, value } }) => (
      <Select
        dropdownClassName="!z-10 h-auto"
        inPortal={false}
        options={options}
        defaultValue={options}
        value={value}
        onChange={onChange}
        name={name}
        label={label}
        error={error}
        getOptionValue={(option) => option.value}
        getOptionDisplayValue={(option) =>
          renderOptionDisplayValue(option.label as string)
        }
        displayValue={(selected: string) => {
          const selectedOption = options.find(
            (option) => option.value === selected
          );
          return selectedOption
            ? renderOptionDisplayValue(selectedOption.label as string)
            : '';
        }}
      />
    )}
  />
);

export default ControlledSelect;
