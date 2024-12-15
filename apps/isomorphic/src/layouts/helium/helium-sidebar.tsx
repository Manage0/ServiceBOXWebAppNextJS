'use client';

import Link from 'next/link';
import cn from '@core/utils/class-names';
import Image from 'next/image';
import SimpleBar from '@core/ui/simplebar';
import { siteConfig } from '@/config/site.config';
import { HeliumSidebarMenu } from './helium-sidebar-menu';

export default function HeliumSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'fixed bottom-0 start-0 z-50 h-full w-[284px] dark:bg-gray-100/50 xl:p-5 2xl:w-[308px]',
        className
      )}
    >
      <div className="sticky top-0 z-40 flex justify-center px-6 pb-5 pt-5 2xl:px-8 2xl:pt-6">
        <Link href={'/'} aria-label="Site Logo">
          <Image
            src="/logo-primary.svg"
            alt={siteConfig.title}
            width={238}
            height={94}
            priority
          />
        </Link>
      </div>
      <div className="h-[calc(100%-124px)] bg-[#25282B] p-1.5 pl-0 pr-1.5 dark:bg-gray-100/70 xl:rounded-2xl">
        <SimpleBar className="h-full">
          <HeliumSidebarMenu />
        </SimpleBar>
      </div>
    </aside>
  );
}
