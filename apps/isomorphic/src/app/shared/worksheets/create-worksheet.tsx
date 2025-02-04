'use client';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, Textarea } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { AddInvoiceItems } from '@/app/shared/invoice/add-invoice-items';
import { toast } from 'react-hot-toast';
import {
  InvoiceFormInput,
  invoiceFormSchema,
} from '@/validators/create-invoice.schema';
import { Label, LabeledInput } from '../account-settings/personal-info';
import WorksheetFormFooter from '@core/components/worksheet-form-footer';
import AddBtn from '../add-btn';
import { FileInput } from '../file-upload';
import ControlledDatePicker from './ControlledDatePicker';
import ControlledSelect from './ControlledSelect';

const invoiceItems = [
  { item: '', description: '', quantity: 1, price: undefined },
];

const dummyOptions = [{ label: 'Dummy', value: 'dummy' }];

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
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Státusz"
                  error={errors?.status?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="fromName"
                  control={control}
                  label="Prioritás"
                  error={errors?.fromName?.message}
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
                <ControlledDatePicker
                  name="createDate"
                  control={control}
                  label="Bizonylat kelte"
                />
                <ControlledDatePicker
                  name="createDate"
                  control={control}
                  label="Vállalási határidő"
                />
                <ControlledDatePicker
                  name="createDate"
                  control={control}
                  label="Elkészült"
                />
                <ControlledDatePicker
                  name="createDate"
                  control={control}
                  label="Átadva"
                />
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
                    <ControlledSelect
                      options={dummyOptions}
                      name="status"
                      control={control}
                      label="Munkatárs"
                      error={errors?.status?.message}
                    />
                  </LabeledInput>
                  <AddBtn
                    onClick={() => console.log('Munkatárs hozzáadva')}
                    variant="gray"
                  />
                </div>
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Partner adatai'}
                description={'Válaszd ki, hogy kinek szól a bizonylat'}
              >
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Partner"
                  error={errors?.status?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Telephely"
                  error={errors?.status?.message}
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
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Ország"
                  error={errors?.status?.message}
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
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Eszköz neve"
                  error={errors?.status?.message}
                />
                <Input
                  label="Eszköz azonosítója"
                  {...register('fromName')}
                  error={errors.fromName?.message}
                />
                <AddBtn
                  onClick={() => console.log('Munkatárs hozzáadva')}
                  variant="gray"
                />
                <div className="col-span-2">
                  <Textarea
                    label="Átvett tartozék"
                    {...register('toAddress')}
                    error={errors.toAddress?.message}
                    textareaClassName="h-20"
                    className="mb-5 w-full"
                  />
                  <FileInput
                    className="w-full"
                    btnLabel="Mentés a munkalaphoz"
                  />
                </div>
              </FormBlockWrapper>
              <FormBlockWrapper
                title={'Kiszállás'}
                description={
                  'Írd be, hogy mennyi időt vett igénybe a szerviz, ha fel szeretnéd osztani a kiszállás költségeit, válaszd ki, hogy melyik munkalappal ossza fel'
                }
              >
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Indulás"
                  error={errors?.status?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Érkezés"
                  error={errors?.status?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Távozás"
                  error={errors?.status?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Visszaérkezés"
                  error={errors?.status?.message}
                />
                <LabeledInput>
                  <Label>
                    <b>Összekapcsolás munkalappal</b>
                  </Label>
                  <ControlledSelect
                    options={dummyOptions}
                    name="status"
                    control={control}
                    label="Munkalap azonosító"
                    error={errors?.status?.message}
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
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Sablon használata"
                  error={errors?.status?.message}
                />
                <AddBtn
                  style={{ alignSelf: 'end' }}
                  className="ml-3.5 w-full max-w-[200px] @lg:w-auto"
                  onClick={() => console.log('Mentve új sablonként')}
                  text="Mentés új sablonként"
                />
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
                <ControlledSelect
                  options={dummyOptions}
                  name="status"
                  control={control}
                  label="Sablon használata"
                  error={errors?.status?.message}
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
