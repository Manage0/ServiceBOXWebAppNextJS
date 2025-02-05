'use client';

import { useState, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, Textarea } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { AddInvoiceItems } from '@/app/shared/invoice/add-invoice-items';
import { toast } from 'react-hot-toast';
import {
  WorksheetFormTypes,
  WorksheetFormSchema,
  defaultValues,
} from '@/validators/worksheet.schema';
import { Label, LabeledInput } from '../account-settings/personal-info';
import WorksheetFormFooter from '@core/components/worksheet-form-footer';
import AddBtn from '../add-btn';
import { FileInput } from '../file-upload';
import ControlledDatePicker from './ControlledDatePicker';
import ControlledSelect from './ControlledSelect';
import countryOptions from '../countryOptions';

const statusOptions = [
  { label: 'Új munkalap', value: 'new' },
  { label: 'Folyamatban', value: 'pending' },
  { label: 'Elkészült', value: 'completed' },
  { label: 'Aláírás alatt', value: 'outforsignature' },
  { label: 'Vázlat', value: 'draft' },
  { label: 'Lezárt', value: 'closed' },
];

const priorityOptions = [
  { label: 'Leggyengébb', value: 'weakest' },
  { label: 'Gyenge', value: 'weak' },
  { label: 'Normál', value: 'normal' },
  { label: 'Erős', value: 'strong' },
  { label: 'Legerősebb', value: 'strongest' },
];
const dummyOptions = [{ label: 'Dummy', value: 'dummy' }];

export default function CreateWorksheet({
  id,
  record,
}: {
  id?: string;
  record?: WorksheetFormTypes;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [siteOptions, setSiteOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [partnerOptions, setPartnerOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    // Fetch site options
    fetch('/api/sites')
      .then((response) => response.json())
      .then((data) => {
        if ((data as { error?: string }).error) {
          throw new Error((data as { error: string }).error);
        }
        const siteData = data as { name: string; site_id: string }[];
        const options = siteData.map((site) => ({
          label: site.name,
          value: site.site_id,
        }));
        setSiteOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching site options:', error);
        if (error instanceof Error) {
          toast.error('Hiba a telephelyek betöltése során: ' + error.message);
        } else {
          toast.error('Hiba a telephelyek betöltése során');
        }
      });

    // Fetch partner options
    fetch('/api/partners')
      .then((response) => response.json())
      .then((data) => {
        const partnerData = data as { name: string; id: string }[];
        const options = partnerData.map((partner) => ({
          label: partner.name,
          value: partner.id,
        }));
        setPartnerOptions(options);
      })
      .catch((error) =>
        console.error('Error fetching partner options:', error)
      );
  }, []);

  const onSubmit: SubmitHandler<WorksheetFormTypes> = (data) => {
    const selectedPartner = partnerOptions.find(
      (option) => option.value === String(data.partner_id)
    );
    if (selectedPartner) {
      data.partner_name = selectedPartner.label;
    }
    toast.success(
      <Text as="b">Worksheet successfully {id ? 'updated' : 'created'}</Text>
    );
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createWorksheet data ->', data);
      setReset(defaultValues);
    }, 600);
  };

  return (
    <Form<WorksheetFormTypes>
      //validationSchema={WorksheetFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: record || defaultValues,
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
                  options={statusOptions}
                  name="status"
                  control={control}
                  label="Státusz"
                  error={errors?.status?.message}
                />
                <ControlledSelect
                  options={priorityOptions}
                  name="priority"
                  control={control}
                  label="Prioritás"
                  error={errors?.priority?.message}
                />
                <Input
                  label="JIRA Ticket száma"
                  {...register('jira_ticket_num')}
                  error={errors.jira_ticket_num?.message}
                />
                <Input
                  label="Munkalap sorszám"
                  {...register('worksheet_id')}
                  error={errors.worksheet_id?.message}
                />
                <Input
                  label="Számla sorszám"
                  {...register('invoice_number')}
                  error={errors.invoice_number?.message}
                />
                <Input
                  label="Beszerzési PO szám"
                  {...register('procurement_po')}
                  error={errors.procurement_po?.message}
                />
                <ControlledDatePicker
                  name="creation_date"
                  control={control}
                  label="Bizonylat kelte"
                />
                <ControlledDatePicker
                  name="deadline_date"
                  control={control}
                  label="Vállalási határidő"
                />
                <ControlledDatePicker
                  name="completion_date"
                  control={control}
                  label="Elkészült"
                />
                <ControlledDatePicker
                  name="handover_date"
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
                  options={partnerOptions}
                  name="partner_id"
                  control={control}
                  label="Partner"
                  error={errors?.partner_id?.message}
                />
                <ControlledSelect
                  options={siteOptions}
                  name="site_id"
                  control={control}
                  label="Telephely"
                  error={errors?.site_id?.message}
                />
                <Input
                  label="Adószám"
                  {...register('tax_num')}
                  error={errors.tax_num?.message}
                />
                <Input
                  label="Irányítószám"
                  {...register('postal_code')}
                  error={errors.postal_code?.message}
                />
                <ControlledSelect
                  options={countryOptions}
                  name="country"
                  control={control}
                  label="Ország"
                  error={errors?.country?.message}
                />
                <Input
                  label="Település"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <Input
                  label="Cím"
                  {...register('address')}
                  error={errors.address?.message}
                />
                <Input
                  label="Email"
                  {...register('email')}
                  error={errors.email?.message}
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
                  {...register('received_accessories')}
                  error={errors.received_accessories?.message}
                />
                <AddBtn
                  onClick={() => console.log('Eszköz hozzáadva')}
                  variant="gray"
                />
                <div className="col-span-2">
                  <Textarea
                    label="Átvett tartozék"
                    {...register('received_accessories')}
                    error={errors.received_accessories?.message}
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
                  name="departure_time"
                  control={control}
                  label="Indulás"
                  error={errors?.departure_time?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="arrival_time"
                  control={control}
                  label="Érkezés"
                  error={errors?.arrival_time?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="go_time"
                  control={control}
                  label="Távozás"
                  error={errors?.go_time?.message}
                />
                <ControlledSelect
                  options={dummyOptions}
                  name="rearrival_time"
                  control={control}
                  label="Visszaérkezés"
                  error={errors?.rearrival_time?.message}
                />
                <LabeledInput>
                  <Label>
                    <b>Összekapcsolás munkalappal</b>
                  </Label>
                  <ControlledSelect
                    options={dummyOptions}
                    name="worksheet_id"
                    control={control}
                    label="Munkalap azonosító"
                    error={errors?.worksheet_id?.message}
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
                  {...register('issue_description')}
                  error={errors.issue_description?.message}
                  textareaClassName="h-20"
                  className="col-span-2"
                />
                <Textarea
                  label="Elvégzett munka leírása"
                  {...register('work_description')}
                  error={errors.work_description?.message}
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
                  {...register('public_comment')}
                  error={errors.public_comment?.message}
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
                  {...register('private_comment')}
                  error={errors.private_comment?.message}
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
