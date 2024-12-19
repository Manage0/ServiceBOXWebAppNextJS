import cn from '@core/utils/class-names';
import { Checkbox } from 'rizzui';

interface FormGroupProps {
  title: React.ReactNode;
  className?: string;
  description?: string;
  children?: React.ReactNode;
  checkboxValue?: 'checked' | 'indeterminate' | 'unchecked';
}

export default function FormGroup({
  title,
  className,
  description,
  children,
  checkboxValue,
}: FormGroupProps) {
  return (
    <div className={cn('grid gap-5 @3xl:grid-cols-12', className)}>
      <div className="col-span-full @4xl:col-span-4">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {checkboxValue && (
            <Checkbox
              className="custom-checkbox mr-[20px] mt-[-2px]"
              checked={checkboxValue === 'checked'}
              indeterminate={checkboxValue === 'indeterminate'}
              readOnly
            />
          )}
          <h4 className="text-base font-medium">{title}</h4>
        </div>
        {description && <p className="mt-2">{description}</p>}
      </div>
      {children && (
        <div className="col-span-full grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
          {children}
        </div>
      )}
    </div>
  );
}
