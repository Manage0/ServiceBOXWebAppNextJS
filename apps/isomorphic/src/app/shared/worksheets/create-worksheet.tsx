'use client';

import { useState, useEffect, useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Form } from '@core/ui/form';
import { Input, Select, Textarea } from 'rizzui';
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
import {
  countryOptions,
  statusOptions,
  priorityOptions,
  timeOptions,
} from '../options';
import { CompanyFormTypes } from '@/validators/company-info.schema';
import {
  fetchInitialData,
  handlePartnerChange,
  handleTemplateChange,
} from '@/utils';
import SaveTemplateModalView from '../account-settings/modal/add-description-template';
import CommentSection from './CommentSection';
import DevicesForm from './DevicesForm';
import { DescriptionTemplateOption, PartnerOption, User } from '@/types';

export default function CreateWorksheet({
  id,
  record,
}: {
  id?: string;
  record?: WorksheetFormTypes;
}) {
  const { data: session } = useSession();
  const [userName, setUserName] = useState<User | null>(null);
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [siteOptions, setSiteOptions] = useState<
    { label: string; value: number; partner_id: number }[]
  >([]);
  const [filteredSiteOptions, setFilteredSiteOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [partnerOptions, setPartnerOptions] = useState<PartnerOption[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [worksheetOptions, setWorksheetOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [companyData, setCompanyData] = useState<CompanyFormTypes | null>(null);
  const [descriptionTemplates, setDescriptionTemplates] = useState<
    DescriptionTemplateOption[]
  >([]);
  const [products, setProducts] = useState<
    {
      id: number;
      name: string;
      stock: number;
      status: string;
      image?: string;
      category: string;
      measure: string;
    }[]
  >([]); // New state for products
  const [productOptions, setProductOptions] = useState<
    { label: string; value: number }[]
  >([]); // New state for product options
  const [selectedDescriptionTemplate, setSelectedDescriptionTemplate] =
    useState<DescriptionTemplateOption | null>(null);

  const prevSelectedDescriptionTemplate =
    useRef<DescriptionTemplateOption | null>(null);

  useEffect(() => {
    fetchInitialData(
      setSiteOptions,
      setPartnerOptions,
      setAssigneeOptions,
      setWorksheetOptions,
      setCompanyData,
      setDescriptionTemplates,
      setProducts,
      setProductOptions,
      session,
      setUserName
    );

    if (record) {
      setReset(record);
    }
  }, [session, session?.user?.id, record]);

  const onSubmit: SubmitHandler<WorksheetFormTypes> = async (data) => {
    console.log('Worksheet submission data ->', data);
    console.log('partnerOptions:', partnerOptions);
    console.log('data.partner_id:', data.partner_id);

    if (!data.partner_id) {
      toast.error('A partner kiválasztása kötelező.');
      return;
    }

    if (!data.site_id) {
      toast.error('A telephely kiválasztása kötelező.');
      return;
    }

    const selectedPartner = partnerOptions.find(
      (option) => option.value === data.partner_id
    );
    if (selectedPartner) {
      data.partner_name = selectedPartner.label;
      data.tax_num = selectedPartner.tax_num;
      data.postal_code = selectedPartner.postal_code;
      data.country = selectedPartner.country;
      data.city = selectedPartner.city;
      data.address = selectedPartner.address;
      data.email = selectedPartner.email;
    } else {
      console.error('Partner not found for partner_id:', data.partner_id);
    }

    if (companyData) {
      data.company_name = companyData.company_name;
      data.company_address = companyData.address;
      data.company_tax_num = companyData.tax_number;
    }

    if (userName) {
      data.creator_name = `${userName.surname} ${userName.forename}`;
    }

    data.creation_date = new Date();

    try {
      const isUpdating = Boolean(record); // If `record` exists, update instead of create
      const apiMethod = isUpdating ? 'PUT' : 'POST';
      const apiUrl =
        isUpdating && record
          ? `/api/worksheets/${record.id}`
          : '/api/worksheets';

      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isUpdating ? 'update' : 'create'} worksheet`
        );
      }

      const result = (await response.json()) as { id: number };

      await fetch('/api/ws_ws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wsid1: record?.id ?? result.id, // Use existing ID if updating
          wsid2: data.connected_worksheet_ids,
        }),
      });

      // Notify assignees if the status has changed
      if (
        (record &&
          record.status !== data.status &&
          data.assignees &&
          data.assignees.length) ||
        (!record && data.assignees && data.assignees.length)
      ) {
        await fetch('/api/notify-assignees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: data.assignees,
            worksheetId: record?.id ?? result.id,
            newStatus: data.status,
            changingPerson: session?.user?.email,
          }),
        });
      }

      toast.success(
        <b>Munkalap sikeresen {isUpdating ? 'szerkesztve' : 'létrehozva'}</b>
      );
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (record) {
          window.location.reload();
        }
        setReset(defaultValues);
      }, 600);
    } catch (error) {
      console.error('Error submitting worksheet:', error);
      toast.error('Hiba történt a munkalap beküldése során.');
    }
  };

  const prevSelectedPartnerId = useRef<number | null>(null);

  // Use useRef to avoid constant updates
  const prevDevicesRef = useRef(record?.devices);
  const prevProductsRef = useRef(record?.products);

  if (
    !siteOptions.length ||
    !partnerOptions.length ||
    !assigneeOptions.length ||
    !companyData ||
    !products.length ||
    !productOptions.length
  ) {
    return <div>Betöltés...</div>;
  }

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
      {({ register, control, watch, setValue, formState: { errors } }) => {
        const issueDescription = watch('issue_description');
        const workDescription = watch('work_description');
        const selectedPartnerId = watch('partner_id');

        if (selectedPartnerId !== prevSelectedPartnerId.current) {
          handlePartnerChange(
            selectedPartnerId,
            siteOptions,
            partnerOptions,
            setFilteredSiteOptions,
            setValue
          );
          prevSelectedPartnerId.current = selectedPartnerId;
        }

        if (
          selectedDescriptionTemplate !==
          prevSelectedDescriptionTemplate.current
        ) {
          handleTemplateChange(selectedDescriptionTemplate, setValue);
          prevSelectedDescriptionTemplate.current = selectedDescriptionTemplate;
        }

        setTimeout(() => {
          if (record?.devices && prevDevicesRef.current !== undefined) {
            setValue('devices', record.devices);
            prevDevicesRef.current = undefined;
          }
          if (record?.products && prevProductsRef.current !== undefined) {
            setValue('products', record.products);
            prevProductsRef.current = undefined;
          }
          if (record?.connected_worksheet_ids) {
            setValue('connected_worksheet_ids', record.connected_worksheet_ids);
          }
        }, 500);

        return (
          <>
            <div className="flex-grow pb-10">
              <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                <FormBlockWrapper
                  title={'Munkalap adatok'}
                  description={
                    'Töltsd ki a munkalap adatait részletesen, ha többen dolgoztok egy munkán, add hozzá munkatásaidat is'
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
                    name="invoice_date"
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
                  <div className="col-span-2 flex flex-col">
                    <LabeledInput>
                      <Label>
                        <b>Hozzáférés</b>
                      </Label>
                      <ControlledSelect
                        options={assigneeOptions}
                        name="assignees"
                        control={control}
                        isMulti={true}
                        label="Munkatárs"
                        error={errors?.assignees?.message}
                      />
                    </LabeledInput>
                    {/*<AddBtn
                      onClick={() => console.log('Munkatárs hozzáadva')}
                      variant="gray"
                    />*/}
                  </div>
                </FormBlockWrapper>
                <FormBlockWrapper
                  title={'Partner adatai'}
                  description={'Válaszd ki, hogy kinek szól a bizonylat'}
                  className="pt-5"
                >
                  <ControlledSelect
                    searchable={true}
                    options={partnerOptions}
                    name="partner_id"
                    control={control}
                    label="Partner"
                    error={errors?.partner_id?.message}
                  />
                  <ControlledSelect
                    searchable={true}
                    options={filteredSiteOptions}
                    name="site_id"
                    control={control}
                    label="Telephely"
                    error={errors?.site_id?.message}
                  />
                  <Input
                    label="Adószám"
                    {...register('tax_num')}
                    error={errors.tax_num?.message}
                    disabled
                  />
                  <Input
                    label="Irányítószám"
                    {...register('postal_code')}
                    error={errors.postal_code?.message}
                    disabled
                  />
                  <ControlledSelect
                    options={countryOptions}
                    name="country"
                    control={control}
                    label="Ország"
                    error={errors?.country?.message}
                    disabled
                  />
                  <Input
                    label="Település"
                    {...register('city')}
                    error={errors.city?.message}
                    disabled
                  />
                  <Input
                    label="Cím"
                    {...register('address')}
                    error={errors.address?.message}
                    disabled
                  />
                  <Input
                    label="Email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled
                  />
                </FormBlockWrapper>
                <FormBlockWrapper
                  title={'Eszköz információ'}
                  description={
                    'Írd le, hogy melyik eszköz(ök)ről szól a munkalap'
                  }
                  className="pt-5"
                >
                  <DevicesForm
                    control={control}
                    productOptions={productOptions}
                    errors={errors}
                    register={register}
                  />
                  <div className="col-span-2">
                    <Textarea
                      label="Átvett tartozék"
                      {...register('received_accessories')}
                      error={errors.received_accessories?.message}
                      textareaClassName="h-20"
                      className="mb-5 w-full"
                    />
                    {/*<FileInput
                      className="w-full"
                      btnLabel="Mentés a munkalaphoz"
                    />*/}
                  </div>
                </FormBlockWrapper>
                <FormBlockWrapper
                  title={'Kiszállás'}
                  description={
                    'Írd be, hogy mennyi időt vett igénybe a szerviz, ha fel szeretnéd osztani a kiszállás költségeit, válaszd ki, hogy melyik munkalappal ossza fel'
                  }
                  className="pt-5"
                >
                  <ControlledSelect
                    options={timeOptions}
                    name="departure_time"
                    control={control}
                    label="Indulás"
                    error={errors?.departure_time?.message}
                  />
                  <ControlledSelect
                    options={timeOptions}
                    name="arrival_time"
                    control={control}
                    label="Érkezés"
                    error={errors?.arrival_time?.message}
                  />
                  <ControlledSelect
                    options={timeOptions}
                    name="start_time"
                    control={control}
                    label="Távozás"
                    error={errors?.go_time?.message}
                  />
                  <ControlledSelect
                    options={timeOptions}
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
                      options={worksheetOptions}
                      name="connected_worksheet_ids"
                      control={control}
                      isMulti={true}
                      label="Munkalap azonosítók"
                      error={errors?.connected_worksheet_ids?.message}
                    />
                  </LabeledInput>
                </FormBlockWrapper>
                <FormBlockWrapper
                  title={'Hiba / Munka leírása'}
                  description={
                    'Írd ide a feladat leírását és minden hozzá kapcsolódó információt'
                  }
                  className="pt-5"
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
                  <Select
                    options={descriptionTemplates.map(
                      (descriptionTemplate) => ({
                        label: descriptionTemplate.name,
                        value: descriptionTemplate.id,
                      })
                    )}
                    name="description_template"
                    label="Sablon használata"
                    onChange={(selectedDescriptionTemplateId) => {
                      const descriptionTemplate = descriptionTemplates.find(
                        (descriptionTemplate) =>
                          descriptionTemplate.id ===
                          (selectedDescriptionTemplateId as { value: string })
                            .value
                      );
                      if (descriptionTemplate) {
                        setSelectedDescriptionTemplate(descriptionTemplate);
                      }
                    }}
                    value={selectedDescriptionTemplate?.name}
                    placeholder=""
                  />
                  {issueDescription && workDescription && (
                    <AddBtn
                      style={{ alignSelf: 'end' }}
                      className="ml-3.5 w-full max-w-[200px] @lg:w-auto"
                      modalView={
                        <SaveTemplateModalView
                          issueDescription={issueDescription}
                          workDescription={workDescription}
                        />
                      }
                      text="Mentés új sablonként"
                    />
                  )}
                </FormBlockWrapper>
                <CommentSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
                <AddInvoiceItems
                  watch={watch}
                  control={control}
                  register={register}
                  errors={errors}
                  products={products} // Pass products to AddInvoiceItems
                  setValue={setValue}
                />
              </div>
            </div>

            <WorksheetFormFooter
              isLoading={isLoading}
              submitBtnText={'Mentés'}
            />
          </>
        );
      }}
    </Form>
  );
}
