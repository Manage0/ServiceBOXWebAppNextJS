import { useFieldArray } from 'react-hook-form'; // To handle dynamic fields
import ControlledSelect from './ControlledSelect';
import { Input, SelectOption } from 'rizzui';
import AddBtn from '../add-btn';

const DevicesForm = ({ control, productOptions, errors, register }: any) => {
  // Use useFieldArray to dynamically add/remove device fields
  const { fields, append } = useFieldArray({
    control,
    name: 'devices', // devices will be part of the form data
  });

  productOptions = productOptions.map((product: SelectOption) => {
    return { value: product.label, label: product.label };
  });

  return (
    <div>
      {fields.map((device, index) => (
        <div key={device.id} className="flex flex-col gap-4">
          {/* ControlledSelect for device name */}
          <ControlledSelect
            name={`devices[${index}].name`} // Unique name for each device
            control={control}
            label="Eszköz neve"
            options={productOptions}
            error={errors?.devices?.[index]?.name?.message} // Handle error for each device
          />
          {/* Input for device id */}
          <Input
            name={`devices[${index}].id`} // Unique name for each device
            label="Eszköz azonosítója"
            error={errors?.devices?.[index]?.id?.message} // Handle error for each device
            {...register(`devices[${index}].id`)}
          />
        </div>
      ))}

      {/* Button to add a new device */}
      <AddBtn
        onClick={() => append({ name: '', id: '' })} // Add a new empty device object
        className="mt-4"
        variant="gray"
      />
    </div>
  );
};

export default DevicesForm;
