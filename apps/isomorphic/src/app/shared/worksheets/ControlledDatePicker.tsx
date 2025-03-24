import { DatePicker } from '@core/ui/datepicker';
import { Controller } from 'react-hook-form';

const ControlledDatePicker = ({
  name,
  control,
  label,
  disabled,
}: {
  name: string;
  control: any;
  label: string;
  disabled?: boolean;
}) => (
  <div className="[&>.react-datepicker-wrapper]:w-full">
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field: { value, onChange } }) => (
        <>
          <DatePicker
            disabled={disabled}
            inputProps={{ label }}
            selected={value}
            onChange={onChange}
          />
        </>
      )}
    />
  </div>
);

export default ControlledDatePicker;
