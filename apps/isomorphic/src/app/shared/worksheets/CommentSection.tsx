'use client';

import { useState, useEffect, useRef } from 'react';
import { Select, Textarea } from 'rizzui';
import { Label } from '../account-settings/personal-info';
import { fetchCommentTemplates } from '@/utils';
import { FormBlockWrapper } from '../invoice/form-utils';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import SaveCommentTemplateModalView from '../account-settings/modal/add-comment-template';
import AddBtn from '../add-btn';

interface CommentTemplateOption {
  id: string;
  name: string;
  public_comment: string;
  private_comment: string;
}

interface CommentSectionProps {
  register: UseFormRegister<WorksheetFormTypes>;
  errors: FieldErrors<WorksheetFormTypes>;
  setValue: UseFormSetValue<WorksheetFormTypes>;
  watch: UseFormWatch<WorksheetFormTypes>;
}

export default function CommentSection({
  register,
  errors,
  setValue,
  watch,
}: CommentSectionProps) {
  const [commentTemplates, setCommentTemplates] = useState<
    CommentTemplateOption[]
  >([]);
  const [selectedCommentTemplate, setSelectedCommentTemplate] =
    useState<CommentTemplateOption | null>(null);
  const prevSelectedCommentTemplate = useRef<CommentTemplateOption | null>(
    null
  );

  useEffect(() => {
    fetchCommentTemplates(setCommentTemplates);
  }, []);

  useEffect(() => {
    if (selectedCommentTemplate !== prevSelectedCommentTemplate.current) {
      setValue('public_comment', selectedCommentTemplate?.public_comment || '');
      setValue(
        'private_comment',
        selectedCommentTemplate?.private_comment || ''
      );
      prevSelectedCommentTemplate.current = selectedCommentTemplate;
    }
  }, [selectedCommentTemplate, setValue]);

  // This is the condition when we want to show the "Save as new template" button
  const publicComment = watch('public_comment');
  const privateComment = watch('private_comment');

  return (
    <FormBlockWrapper
      title={'Megjegyzések'}
      description={
        'Írd ide a feladat leírását és minden hozzá kapcsolódó információt'
      }
      className="pt-5"
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
      {Array.isArray(commentTemplates) && commentTemplates.length > 0 && (
        <Select
          options={commentTemplates.map((template) => ({
            label: template.name,
            value: template.id,
          }))}
          name="comment_template"
          label="Sablon használata"
          onChange={(selectedCommentTemplateId) => {
            const commentTemplate = commentTemplates.find(
              (template) =>
                template.id ===
                (selectedCommentTemplateId as { value: string }).value
            );
            if (commentTemplate) {
              setSelectedCommentTemplate(commentTemplate);
            }
          }}
          value={selectedCommentTemplate?.name}
          placeholder=""
        />
      )}
      {publicComment && privateComment && (
        <AddBtn
          text="Mentés új sablonként"
          modalView={
            <SaveCommentTemplateModalView
              publicComment={publicComment}
              privateComment={privateComment}
            />
          }
          className="ml-3.5 w-full max-w-[200px] @lg:w-auto"
          style={{ alignSelf: 'end' }}
        />
      )}
      <div className="col-span-2">
        <Label>
          <b>Belső használatú (nem nyomtatható) megjegyzés a munkalaphoz</b>
        </Label>
      </div>
      <Textarea
        label="Belső megjegyzés"
        {...register('private_comment')}
        error={errors.private_comment?.message}
        textareaClassName="h-20"
        className="col-span-2"
      />
    </FormBlockWrapper>
  );
}
