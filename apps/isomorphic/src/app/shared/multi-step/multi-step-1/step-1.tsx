import Image from 'next/image';
import { useForm } from 'react-hook-form';
import FormSummary from '@/app/shared/multi-step/multi-step-1/form-summary';
import { useStepperOne } from '@/app/shared/multi-step/multi-step-1';

export default function StepOne() {
  const { step, gotoNextStep } = useStepperOne();

  const { handleSubmit } = useForm();

  const onSubmit = () => {
    gotoNextStep();
  };

  return (
    <>
      <div className="col-span-full flex flex-col justify-center @4xl:col-span-5">
        <FormSummary
          descriptionClassName="@7xl:me-10"
          title="Tell us about your place"
          description="In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room"
        />
      </div>

      <form
        id={`rhf-${step.toString()}`}
        onSubmit={handleSubmit(onSubmit)}
        className="col-span-full grid aspect-[4/3] gap-4 @3xl:grid-cols-12 @4xl:col-span-7 @5xl:gap-5 @7xl:gap-8"
      ></form>
    </>
  );
}
