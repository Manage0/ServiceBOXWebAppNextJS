'use client';

import {
  Text,
  Button,
  Input,
  Textarea,
  ActionIcon,
  Select,
  SelectOption,
} from 'rizzui';
import { useFieldArray, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { PiMinusBold, PiPlusBold, PiTrashBold } from 'react-icons/pi';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';

function QuantityInput({
  name,
  error,
  onChange,
  defaultValue,
}: {
  name?: string;
  error?: string;
  onChange?: (value: number) => void;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue ?? 1);

  function handleIncrement() {
    let newValue = value + 1;
    setValue(newValue);
    onChange && onChange(newValue);
  }

  function handleDecrement() {
    let newValue = value > 1 ? value - 1 : 1;
    setValue(newValue);
    onChange && onChange(newValue);
  }

  function handleOnChange(inputValue: number) {
    setValue(Number(inputValue));
    onChange && onChange(inputValue);
  }

  useEffect(() => {
    setValue(defaultValue ?? 1);
    onChange && onChange(defaultValue ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      label="Mennyiség"
      type="number"
      min={1}
      name={name}
      value={value}
      placeholder="1"
      onChange={(e) => handleOnChange(Number(e.target.value))}
      suffix={
        <>
          <ActionIcon
            title="Decrement"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            onClick={() => handleDecrement()}
          >
            <PiMinusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
          <ActionIcon
            title="Increment"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            onClick={() => handleIncrement()}
          >
            <PiPlusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
        </>
      }
      suffixClassName="flex gap-1 items-center -me-2"
      error={error}
    />
  );
}

export function AddInvoiceItems({
  watch,
  register,
  control,
  errors,
  setValue,
  products,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const productOptions = products.map((product: any) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <FormBlockWrapper
      title={'Felhasznált anyagok, szolgáltatások:'}
      description={
        'Add hozzá a termékeket és szolgáltatásokat amit az elvégzett munka során felhasználtál'
      }
      className="pt-5 @2xl:pt-9 @3xl:pt-11"
    >
      <div className="col-span-2 @container">
        {fields.map((field: any, index) => {
          const selectedProduct = products.find(
            (product: any) => product.id === watch(`products.${index}.id`)
          );

          if (selectedProduct) {
            setValue(`products.${index}.measure`, selectedProduct.measure);
          }

          return (
            <div
              key={field.id}
              className="mb-8 grid grid-cols-1 items-start rounded-lg border border-muted p-4 shadow @md:p-5 @xl:p-6"
            >
              <div className="grid w-full items-start gap-3 @md:grid-cols-2 @lg:gap-4 @xl:grid-cols-3 @2xl:gap-5 @4xl:grid-cols-4">
                <Controller
                  name={`products.${index}.product_name`}
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={productOptions}
                      value={productOptions.find(
                        (option: { value: number }) => {
                          const selected =
                            option.value === watch(`products.${index}.id`);
                          return selected;
                        }
                      )}
                      onChange={(selectedOption: SelectOption) => {
                        onChange(selectedOption.label);
                        setValue(`products.${index}.id`, selectedOption.value);
                      }}
                      name={name}
                      label="Termék"
                      error={errors?.products?.[index]?.product_name?.message}
                    />
                  )}
                />
                <Controller
                  name={`products.${index}.amount`}
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <QuantityInput
                      name={name}
                      onChange={(value) => onChange(value)}
                      defaultValue={field.amount ?? value}
                      error={errors?.products?.[index]?.amount?.message}
                    />
                  )}
                />
                <Controller
                  name={`products.${index}.measure`}
                  control={control}
                  render={({ field: { name, value } }) => (
                    <Input
                      label="Menny. egység"
                      name={name}
                      value={value}
                      disabled
                      className="w-full"
                      error={errors?.products?.[index]?.measure?.message}
                    />
                  )}
                />
                <Textarea
                  label="Megjegyzés számlán és bizonylaton"
                  {...register(`products.${index}.public_comment`)}
                  error={errors?.products?.[index]?.public_comment?.message}
                  textareaClassName="h-20"
                  className="col-span-3"
                />
                <Textarea
                  label="Egyéb megjegyzés (belső használat)"
                  {...register(`products.${index}.private_comment`)}
                  error={errors?.products?.[index]?.private_comment?.message}
                  textareaClassName="h-20"
                  className="col-span-3"
                />
              </div>
              <Button
                variant="text"
                color="danger"
                onClick={() => remove(index)}
                className="-mx-2 -mb-1 ms-auto mt-5 h-auto px-2 py-1 font-semibold"
              >
                <PiTrashBold className="me-1 h-[18px] w-[18px]" /> Törlés
              </Button>
            </div>
          );
        })}

        <div className="flex w-full flex-col items-start justify-between @4xl:flex-row @4xl:pt-6">
          <Button
            onClick={() =>
              append({
                id: '',
                product_name: '',
                amount: 1,
                measure: '',
                price: 0,
                public_comment: '',
                private_comment: '',
              })
            }
            variant="flat"
            className="-mt-2 mb-7 w-full bg-custom-green text-white @4xl:mb-0 @4xl:mt-0 @4xl:w-auto"
          >
            <PiPlusBold className="me-1.5 h-4 w-4" /> Termék hozzáadása
          </Button>
        </div>
      </div>
    </FormBlockWrapper>
  );
}
