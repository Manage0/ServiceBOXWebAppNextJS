'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input, Select, Button, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { fetchDescriptionTemplates } from '@/utils';
import toast from 'react-hot-toast';
import AddBtn from '../../add-btn';

interface SaveTemplateModalViewProps {
  issueDescription: string;
  workDescription: string;
}

interface DescriptionTemplateOption {
  id: string;
  name: string;
  issue_description: string;
  work_description: string;
}

interface SaveTemplateFormInputs {
  template: string;
  new_template_name?: string;
}

export default function SaveTemplateModalView({
  issueDescription,
  workDescription,
}: SaveTemplateModalViewProps) {
  const { closeModal } = useModal();
  const [descriptionTemplates, setDescriptionTemplates] = useState<
    DescriptionTemplateOption[]
  >([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SaveTemplateFormInputs>();

  useEffect(() => {
    fetchDescriptionTemplates(setDescriptionTemplates);
  }, []);

  const selectedTemplate = watch('template');

  const onSubmit: SubmitHandler<SaveTemplateFormInputs> = async (data) => {
    try {
      const url =
        data.template === 'Új sablon'
          ? '/api/description_templates'
          : `/api/description_templates/${data.template}`;
      const method = data.template === 'Új sablon' ? 'POST' : 'PUT';

      const body = {
        name:
          data.template === 'Új sablon'
            ? data.new_template_name
            : descriptionTemplates.find(
                (template) => template.id === data.template
              )?.name,
        issue_description: issueDescription,
        work_description: workDescription,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success('Sablon sikeresen mentve');
        closeModal();
      } else {
        const errorData = (await res.json()) as { error: string };
        toast.error(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Hiba történt a sablon mentése során.');
    }
  };

  return (
    <div className="m-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <Title as="h3" className="text-lg">
          Sablon mentése
        </Title>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form className="space-y-4">
        <Controller
          control={control}
          name="template"
          defaultValue="Új sablon"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Sablon felülírása"
              placeholder="Válassz..."
              options={[
                { label: 'Új sablon', value: 'Új sablon' },
                ...descriptionTemplates.map((template) => ({
                  label: template.name,
                  value: template.id,
                })),
              ]}
              onChange={(selectedOption: { label: string }) =>
                onChange(selectedOption.label)
              }
              value={value}
              error={errors.template?.message}
            />
          )}
        />
        {selectedTemplate === 'Új sablon' && (
          <Input
            label="Új Sablon neve"
            {...register('new_template_name', {
              required: 'A sablon neve kötelező',
            })}
            error={errors.new_template_name?.message}
          />
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal}>
            Mégsem
          </Button>
          <AddBtn text="Mentés" onClick={handleSubmit(onSubmit)} />
        </div>
      </form>
    </div>
  );
}
