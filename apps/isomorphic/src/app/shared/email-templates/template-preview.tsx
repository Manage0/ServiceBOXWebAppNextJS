'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form';
import { Button, Input } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  NewsLetterFormSchema,
  newsLetterFormSchema,
} from '@/validators/newsletter.schema';
import { sendAccountConfirmationEmail } from '@/server/actions/account-confirmation.action';
import { sendOrderConfirmationEmail } from '@/server/actions/order-confirmation.action';
import { messages } from '@/config/messages';

export default function TemplatePreview({
  title = 'Newsletter!',
  // name,
  className,
  description = 'Feel free to preview it by clicking the button below.',
}: {
  // name: string;
  title?: string;
  className?: string;
  description?: string;
}) {
  return (
    <div
      className={cn(
        className,
        'rounded-2xl border border-gray-100 bg-white @container dark:bg-gray-50'
      )}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center p-6 @2xl:p-12 3xl:px-16 4xl:px-28">
        <div className="w-full max-w-[640px]">
          <div className="mb-8 text-center @2xl:mb-12">
            <h2 className="mb-2 text-xl @2xl:mb-3 @2xl:text-2xl">{title}</h2>
            <p className="mx-auto max-w-[45ch] text-sm leading-6 text-gray-500 @2xl:text-base">
              {description}
            </p>
          </div>
          <EmailForm template="accountConfirmation" />
        </div>
      </div>
    </div>
  );
}

const initialValues = {
  email: '',
};

function EmailForm({ template }: { template: string }) {
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<NewsLetterFormSchema> = async (data) => {
    console.log(data);

    setIsLoading(true);
    try {
      if (template === 'accountConfirmation') {
        await sendAccountConfirmationEmail(data);
      }
      if (template === 'orderConfirmation') {
        await sendOrderConfirmationEmail(data);
      }
      setReset(initialValues);
      setIsLoading(false);
      toast.success(messages.emailSentSuccessfully);
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form<NewsLetterFormSchema>
        validationSchema={newsLetterFormSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="relative">
            <Input
              size="xl"
              placeholder="Enter your email"
              inputClassName="w-full text-base pr-36"
              {...register('email')}
              error={errors.email?.message}
            />
            <Button
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="absolute right-1 top-1 text-base font-medium"
            >
              Subscribe
            </Button>
          </div>
        )}
      </Form>
      <p className="mt-3 text-center text-sm font-medium text-gray-500 @2xl:mt-4 @2xl:text-base">
        Your email is safe with us, we don’t spam.
      </p>
    </>
  );
}
