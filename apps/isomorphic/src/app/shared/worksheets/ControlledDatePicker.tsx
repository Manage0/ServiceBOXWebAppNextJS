import { DatePicker } from '@core/ui/datepicker';
import { Controller } from 'react-hook-form';

const ControlledDatePicker = ({
  name,
  control,
  label,
}: {
  name: string;
  control: any;
  label: string;
}) => (
  <div className="[&>.react-datepicker-wrapper]:w-full">
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <DatePicker
          inputProps={{ label }}
          selected={value}
          onChange={onChange}
        />
      )}
    />
  </div>
);

export default ControlledDatePicker;
