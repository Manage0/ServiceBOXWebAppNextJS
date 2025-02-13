'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input, Select, Button, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { fetchCommentTemplates } from '@/utils'; // Renamed function to match comments
import toast from 'react-hot-toast';
import AddBtn from '../../add-btn';

interface SaveCommentTemplateModalViewProps {
  publicComment: string; // Renamed prop to publicComment
  privateComment: string; // Renamed prop to privateComment
}

interface CommentTemplateOption {
  id: string;
  name: string;
  public_comment: string; // Renamed field to public_comment
  private_comment: string; // Renamed field to private_comment
}

interface SaveTemplateFormInputs {
  template: string;
  new_template_name?: string;
}

export default function SaveCommentTemplateModalView({
  publicComment, // Updated variable name
  privateComment, // Updated variable name
}: SaveCommentTemplateModalViewProps) {
  const { closeModal } = useModal();
  const [commentTemplates, setCommentTemplates] = useState<
    CommentTemplateOption[]
  >([]); // Renamed state
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SaveTemplateFormInputs>();

  useEffect(() => {
    fetchCommentTemplates(setCommentTemplates); // Updated fetching function
  }, []);

  const selectedTemplate = watch('template');

  const onSubmit: SubmitHandler<SaveTemplateFormInputs> = async (data) => {
    try {
      const url =
        data.template === 'Új sablon'
          ? '/api/comment_templates' // Updated API endpoint
          : `/api/comment_templates/${data.template}`; // Updated API endpoint
      const method = data.template === 'Új sablon' ? 'POST' : 'PUT';

      const body = {
        name:
          data.template === 'Új sablon'
            ? data.new_template_name
            : commentTemplates.find((template) => template.id === data.template)
                ?.name,
        public_comment: publicComment, // Updated to use publicComment
        private_comment: privateComment, // Updated to use privateComment
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
                ...commentTemplates.map((template) => ({
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
