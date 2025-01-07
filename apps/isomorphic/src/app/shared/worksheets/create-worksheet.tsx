'use client';

import { useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, Select, Textarea, Button } from 'rizzui';
import { DatePicker } from '@core/ui/datepicker';
import {
  FormBlockWrapper,
  statusOptions,
  renderOptionDisplayValue,
} from '@/app/shared/invoice/form-utils';
import { AddInvoiceItems } from '@/app/shared/invoice/add-invoice-items';
import { toast } from 'react-hot-toast';
import {
  InvoiceFormInput,
  invoiceFormSchema,
} from '@/validators/create-invoice.schema';
import { Label, LabeledInput } from '../account-settings/personal-info';
import { PiPlusBold } from 'react-icons/pi';
import WorksheetFormFooter from '@core/components/worksheet-form-footer';
import AddBtn from '../add-btn';

const invoiceItems = [
  { item: '', description: '', quantity: 1, price: undefined },
];

export default function CreateInvoice({
  id,
  record,
}: {
  id?: string;
  record?: InvoiceFormInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<InvoiceFormInput> = (data) => {
    toast.success(
      <Text as="b">Invoice successfully {id ? 'updated' : 'created'}</Text>
    );
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createInvoice data ->', data);
      setReset({
        fromName: '',
        fromAddress: '',
        fromPhone: '',
        toName: '',
        toAddress: '',
        toPhone: '',
        shipping: '',
        discount: '',
        taxes: '',
        createDate: new Date(),
        status: 'draft',
        items: invoiceItems,
      });
    }, 600);
  };

  const newItems = record?.items
    ? record.items.map((item) => ({
        ...item,
      }))
    : invoiceItems;

  return (
    <Form<InvoiceFormInput>
      validationSchema={invoiceFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: {
          ...record,
          invoiceNumber: 'INV-0071',
          createDate: new Date(),
          // status: 'draft',
          items: newItems,
        },
      }}
      className="flex flex-grow flex-col @container [&_label]:font-medium"
    >
      {({ register, control, watch, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
              <FormBlockWrapper
                title={'Munkalap adatok'}
                description={
                  'Töltsd ki a munkalap adatait részletesen, ha többen dolgotok egy munkán, add hozzá munkatásaidat is'
                }
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Státusz"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Prioritás"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Input
                  label="JIRA Ticket száma"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Input
                  label="Munkalap sorszám"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Input
                  label="Számla sorszám"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Input
                  label="Beszerzési PO szám"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <div className="[&>.react-datepicker-wrapper]:w-full">
                  <Controller
                    name="createDate"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        inputProps={{ label: 'Bizonylat kelte' }}
                        selected={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <div className="[&>.react-datepicker-wrapper]:w-full">
                  <Controller
                    name="createDate"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        inputProps={{ label: 'Vállalási határidő' }}
                        selected={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <div className="[&>.react-datepicker-wrapper]:w-full">
                  <Controller
                    name="createDate"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        inputProps={{ label: 'Elkészült' }}
                        selected={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <div className="[&>.react-datepicker-wrapper]:w-full">
                  <Controller
                    name="createDate"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        inputProps={{ label: 'Átadva' }}
                        selected={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'end',
                  }}
                >
                  <LabeledInput>
                    <Label>
                      <b>Hozzáférés</b>
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field: { name, onChange, value } }) => (
                        <Select
                          dropdownClassName="!z-10 h-auto"
                          inPortal={false}
                          options={statusOptions}
                          defaultValue={statusOptions[0]}
                          value={value}
                          onChange={onChange}
                          name={name}
                          label="Munkatárs"
                          error={errors?.status?.message}
                          getOptionValue={(option) => option.value}
                          getOptionDisplayValue={(option) =>
                            renderOptionDisplayValue(option.value as string)
                          }
                          displayValue={(selected: string) =>
                            renderOptionDisplayValue(selected)
                          }
                        />
                      )}
                    />
                  </LabeledInput>
                  <AddBtn onClick={() => console.log('Munkatárs hozzáadva')} />
                </div>
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Partner adatai'}
                description={'Válaszd ki, hogy kinek szól a bizonylat'}
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Partner"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Telephely"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Input
                  label="Adószám"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Input
                  label="Irányítószám"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Ország"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Input
                  label="Település"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Input
                  label="Cím"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <Input
                  label="Email"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Eszköz információ'}
                description={
                  'Írd le, hogy melyik eszköz(ök)ről szól a munkalap'
                }
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Eszköz neve"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Input
                  label="Eszköz azonosítója"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <AddBtn onClick={() => console.log('Munkatárs hozzáadva')} />
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Kiszállás'}
                description={
                  'Írd be, hogy mennyi időt vett igénybe a szerviz, ha fel szeretnéd osztani a kiszállás költségeit, válaszd ki, hogy melyik munkalappal ossza fel'
                }
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Induás"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Érkezés"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Távozás"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Visszarkezés"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <LabeledInput>
                  <Label>
                    <b>Összekapcsolás munkalappal</b>
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field: { name, onChange, value } }) => (
                      <Select
                        dropdownClassName="!z-10 h-auto"
                        inPortal={false}
                        options={statusOptions}
                        defaultValue={statusOptions[0]}
                        value={value}
                        onChange={onChange}
                        name={name}
                        label="Munkalap azonosító"
                        error={errors?.status?.message}
                        getOptionValue={(option) => option.value}
                        getOptionDisplayValue={(option) =>
                          renderOptionDisplayValue(option.value as string)
                        }
                        displayValue={(selected: string) =>
                          renderOptionDisplayValue(selected)
                        }
                      />
                    )}
                  />
                </LabeledInput>
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Hiba / Munka leírása'}
                description={
                  'Írd ide a feladat leírását és minden hozzá kapcsolódó információt'
                }
              >
                <Textarea
                  label="Hiba / Munka oka"
                  {...register('toAddress')}
                  error={errors.toAddress?.message}
                  textareaClassName="h-20"
                  className="col-span-2"
                />
                <Textarea
                  label="Elvégzett munka leírása"
                  {...register('toAddress')}
                  error={errors.toAddress?.message}
                  textareaClassName="h-20"
                  className="col-span-2"
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Sablon használata"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />

                <Button
                  style={{ alignSelf: 'end' }}
                  className="ml-3.5 w-full max-w-[200px] @lg:w-auto"
                >
                  <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                  Mentés új sablonként
                </Button>
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Megjegyzések'}
                description={
                  'Írd ide a feladat leírását és minden hozzá kapcsolódó információt'
                }
              >
                <Label>
                  <b>Nyilvános (nyomtatható) megjegyzés a munkalaphoz</b>
                </Label>
                <Textarea
                  label="Nyilvános megjegyzés"
                  {...register('toAddress')}
                  error={errors.toAddress?.message}
                  textareaClassName="h-20"
                  className="col-span-2"
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      options={statusOptions}
                      defaultValue={statusOptions[0]}
                      value={value}
                      onChange={onChange}
                      name={name}
                      label="Sablon használata"
                      error={errors?.status?.message}
                      getOptionValue={(option) => option.value}
                      getOptionDisplayValue={(option) =>
                        renderOptionDisplayValue(option.value as string)
                      }
                      displayValue={(selected: string) =>
                        renderOptionDisplayValue(selected)
                      }
                    />
                  )}
                />
                <div></div>
                <Label>
                  <b>
                    Belső használatú (nem nyomtatható) megjegyzés a munkalaphoz
                  </b>
                </Label>
                <Textarea
                  label="Belső megjegyzés"
                  {...register('toAddress')}
                  error={errors.toAddress?.message}
                  textareaClassName="h-20"
                  className="col-span-2"
                />
              </FormBlockWrapper>

              <AddInvoiceItems
                watch={watch}
                control={control}
                register={register}
                errors={errors}
              />
            </div>
          </div>

          <WorksheetFormFooter isLoading={isLoading} submitBtnText={'Mentés'} />
        </>
      )}
    </Form>
  );
}
