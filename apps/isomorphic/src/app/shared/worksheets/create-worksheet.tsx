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
  WorksheetFormSchema,
  WorksheetFormTypes,
  WorksheetFormTypesREALLYFORTHEFORM,
  defaultValues,
} from '@/validators/worksheet.schema';
import { Label, LabeledInput } from '../account-settings/personal-info';
import WorksheetFormFooter from '@core/components/worksheet-form-footer';
import AddBtn from '../add-btn';
import { FileInput } from '../file-upload';
import ControlledDatePicker from './ControlledDatePicker';
import ControlledSelect from './ControlledSelect';
import { statusOptions, priorityOptions } from '../options';
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
import PartnerSection from './PartnerSection';

export default function CreateWorksheet({
  record,
}: {
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
  >([]);
  const [productOptions, setProductOptions] = useState<
    { label: string; value: number }[]
  >([]);
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

  const onSubmit: SubmitHandler<WorksheetFormTypesREALLYFORTHEFORM> = async (
    data,
    event
  ) => {
    const submitter = (event as any)?.nativeEvent?.submitter;
    const action = submitter?.name;

    data.invoice_date = new Date();
    console.log('data', data);

    if (record?.status === 'closed') {
      toast.error('A lezárt munkalap nem módosítható.');
      return;
    }
    if (!data.partner_id) {
      toast.error('A partner kiválasztása kötelező.');
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

    try {
      const isUpdating = Boolean(record);
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
          wsid1: record?.id ?? result.id,
          wsid2: data.connected_worksheet_ids,
        }),
      });

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
        if (action === 'save') {
          window.location.href = `/worksheets/`;
        } else if (action === 'finalize') {
          window.location.href = `/worksheets/${result.id}`;
        }
        setReset(defaultValues);
      }, 600);
    } catch (error) {
      console.error('Error submitting worksheet:', error);
      toast.error('Hiba történt a munkalap beküldése során.');
    }
  };

  const fetchNextWorksheetId = async () => {
    try {
      const response = await fetch('/api/worksheets/next-id'); // API to fetch the last worksheet_id
      if (!response.ok) throw new Error('Failed to fetch next worksheet ID');
      const { nextWorksheetId } = (await response.json()) as {
        nextWorksheetId: string;
      };
      return nextWorksheetId;
    } catch (error) {
      console.error('Error fetching next worksheet ID:', error);
      toast.error('Nem sikerült lekérni a következő munkalap azonosítót.');
      return null;
    }
  };

  const prevSelectedPartnerId = useRef<number | null>(null);

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
    <Form<WorksheetFormTypesREALLYFORTHEFORM>
      //validationSchema={WorksheetFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: record || defaultValues,
        mode: 'onSubmit',
      }}
      className="flex flex-grow flex-col @container [&_label]:font-medium"
    >
      {({ register, control, watch, setValue, formState: { errors } }) => {
        const issueDescription = watch('issue_description');
        const workDescription = watch('work_description');
        const selectedPartnerId = watch('partner_id');

        if (!record?.worksheet_id) {
          // Generate the next worksheet_id if not provided
          fetchNextWorksheetId().then((nextId) => {
            if (nextId) {
              setValue('worksheet_id', nextId); // Set the generated worksheet_id in the form
            }
          });
        }

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
        }, 1000);

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
                    error="A státusz megadása kötelező."
                  />
                  <ControlledSelect
                    options={priorityOptions}
                    name="priority"
                    control={control}
                    label="Prioritás"
                    error="A prioritás megadása kötelező."
                  />
                  <Input
                    label="Munkalap sorszám"
                    {...register('worksheet_id')}
                    disabled={true}
                  />
                  <Input
                    label="Számla sorszám"
                    {...register('invoice_number')}
                  />
                  <ControlledDatePicker
                    name="invoice_date"
                    control={control}
                    label="Bizonylat kelte"
                    disabled={true}
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
                      />
                    </LabeledInput>
                  </div>
                </FormBlockWrapper>
                <PartnerSection
                  partnerOptions={partnerOptions}
                  control={control}
                  errors={errors}
                  filteredSiteOptions={filteredSiteOptions}
                  register={register}
                />
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
                      textareaClassName="h-20"
                      className="mb-5 w-full"
                    />
                  </div>
                </FormBlockWrapper>
                <FormBlockWrapper
                  title={'Kiszállás'}
                  description={
                    'Írd be, hogy mennyi időt vett igénybe a szerviz, ha fel szeretnéd osztani a kiszállás költségeit, válaszd ki, hogy melyik munkalappal ossza fel'
                  }
                  className="pt-5"
                >
                  <Input
                    type="time"
                    step="60" // Csak percre pontosan lehessen választani
                    {...register('start_time')}
                    label="Indulás"
                  />
                  <Input
                    type="time"
                    step="60"
                    {...register('arrival_time')}
                    label="Érkezés"
                  />
                  <Input
                    type="time"
                    step="60"
                    {...register('departure_time')}
                    label="Távozás"
                  />
                  <Input
                    type="time"
                    step="60"
                    {...register('rearrival_time')}
                    label="Visszaérkezés"
                  />
                  <LabeledInput>
                    <Label>
                      <b>Összekapcsolás munkalappal</b>
                    </Label>
                    <ControlledSelect
                      options={worksheetOptions.filter(
                        (option) => option.value !== Number(record?.id)
                      )}
                      name="connected_worksheet_ids"
                      control={control}
                      isMulti={true}
                      label="Munkalap azonosítók"
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
                    textareaClassName="h-20"
                    className="col-span-2"
                  />
                  <Textarea
                    label="Elvégzett munka leírása"
                    {...register('work_description')}
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
                  products={products}
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
