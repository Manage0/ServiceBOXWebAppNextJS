import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cn from '@core/utils/class-names';
import { PiCaretDownBold } from 'react-icons/pi';
import { menuItems } from '@/layouts/helium/helium-menu-items';

export function HeliumSidebarMenu() {
  const pathname = usePathname();

  return (
    <div className="mt-4 pb-3 3xl:mt-6">
      {menuItems.map((item, index) => {
        const isActive = pathname === (item?.href as string);

        return (
          <Link
            key={item.name + '-' + index}
            href={item?.href}
            className={cn(
              'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
              isActive
                ? 'before:top-2/5 bg-white text-[#25282B] before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-white dark:text-gray-900 2xl:before:-start-5'
                : 'text-white transition-colors duration-200 dark:text-gray-500'
            )}
          >
            <div className="flex items-center truncate">
              {item?.icon && (
                <span
                  className={cn(
                    'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-200 [&>svg]:h-[20px] [&>svg]:w-[20px]',
                    isActive
                      ? 'text-[#25282B] dark:text-gray-900'
                      : 'text-white dark:text-gray-500'
                  )}
                >
                  {typeof item?.icon === 'function'
                    ? item?.icon(isActive)
                    : item?.icon}
                </span>
              )}
              <span className="truncate">{item.name}</span>
            </div>
            <PiCaretDownBold
              strokeWidth={3}
              className={cn(
                'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                isActive ? 'text-[#25282B]' : 'text-white'
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
