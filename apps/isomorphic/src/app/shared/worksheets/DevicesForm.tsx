import { useFieldArray } from 'react-hook-form'; // To handle dynamic fields
import ControlledSelect from './ControlledSelect';
import { Input, SelectOption } from 'rizzui';
import AddBtn from '../add-btn';
import { FaTrash } from 'react-icons/fa'; // Import trash icon

const DevicesForm = ({ control, productOptions, errors, register }: any) => {
  // Use useFieldArray to dynamically add/remove device fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'devices', // devices will be part of the form data
  });

  productOptions = productOptions.map((product: SelectOption) => {
    return { value: product.label, label: product.label };
  });

  return (
    <div className="col-span-2">
      {fields.map((device, index) => (
        <div
          key={device.id}
          className="mt-4 grid grid-cols-3 items-center gap-4"
        >
          {/*JSON.stringify(device)*/}
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
            name={`devices[${index}].device_id`} // Unique name for each device
            label="Eszköz azonosítója"
            error={errors?.devices?.[index]?.device_id?.message} // Handle error for each device
            {...register(`devices[${index}].device_id`)}
          />
          {/* Trash icon to remove device */}
          <FaTrash
            className="relative mt-5 cursor-pointer text-gray-500"
            onClick={() => remove(index)}
            style={{ alignSelf: 'center' }}
          />
        </div>
      ))}

      {/* Button to add a new device */}
      <AddBtn
        onClick={() => append({ id: '', device_id: '', name: '' })} // Add a new empty device object
        className="mt-4"
        variant="gray"
      />
    </div>
  );
};

export default DevicesForm;
