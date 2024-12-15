import { PiMagnifyingGlass } from 'react-icons/pi';
import cn from '@core/utils/class-names';

type SearchTriggerProps = {
  placeholderClassName?: string;
  icon?: React.ReactNode;
  lang?: string;
  t?: (key: string) => string | undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SearchTrigger({
  icon,
  className,
  placeholderClassName,
  t,
  ...props
}: SearchTriggerProps) {
  return (
    <button
      aria-label="Search"
      className={cn(
        'group inline-flex items-center focus:outline-none active:translate-y-px xl:h-10 xl:w-full xl:max-w-sm xl:rounded-lg xl:border xl:border-muted xl:py-2 xl:pe-2 xl:ps-3.5 xl:shadow-sm xl:backdrop-blur-md xl:transition-colors xl:duration-200 xl:hover:border-gray-900 xl:hover:outline-double xl:hover:outline-[0.5px] xl:hover:outline-gray-900 xl:focus-visible:border-gray-900 xl:focus-visible:outline-double xl:focus-visible:outline-[0.5px] xl:focus-visible:outline-gray-900',
        className
      )}
      {...props}
    >
      {icon ? (
        icon
      ) : (
        <PiMagnifyingGlass className="magnifying-glass me-2 h-[18px] w-[18px]" />
      )}
      <span
        className={cn(
          'placeholder-text hidden text-sm text-[#A3A3A3] xl:inline-flex',
          placeholderClassName
        )}
      >
        Keress az oldaladon...
      </span>
    </button>
  );
}
