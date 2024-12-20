'use client';

import Link from 'next/link';
import { ActionIcon, Badge } from 'rizzui';
import SearchWidget from '@/app/shared/search/search';
import NotificationDropdown from '@/layouts/notification-dropdown';
import ProfileMenu from '@/layouts/profile-menu';
import HamburgerButton from '@/layouts/hamburger-button';
import Logo from '@core/components/logo';
import Sidebar from './helium-sidebar';
import Image from 'next/image';
import { usePresets } from '@/config/color-presets';
import {
  useApplyColorPreset,
  useColorPresets,
} from '../settings/use-theme-color';

function HeaderMenuRight() {
  const COLOR_PRESETS = usePresets();
  const { colorPresets } = useColorPresets();

  useApplyColorPreset<any>(colorPresets ?? COLOR_PRESETS[0].colors);

  return (
    <div className="ms-auto grid shrink-0 grid-cols-3 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      <NotificationDropdown>
        <ActionIcon
          aria-label="Notification"
          variant="text"
          className="relative flex h-[40px] w-[40px] items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm"
        >
          <Image
            src={'/Notification.svg'}
            alt="Notification icon"
            width={22}
            height={22}
          />
          {/*<Badge
            renderAsDot
            color="warning"
            enableOutlineRing
            className="absolute right-1 top-2.5 -translate-x-1 -translate-y-1/4"
          />*/}
        </ActionIcon>
      </NotificationDropdown>
      <Link
        href={'/forms/profile-settings'}
        className="relative flex h-[40px] w-[40px] items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm"
      >
        <Image
          src={'/SettingsBlack.svg'}
          alt="Settings icon"
          width={22}
          height={22}
        />
      </Link>
      <ProfileMenu />
    </div>
  );
}

export default function Header() {
  return (
    <header
      className={
        'sticky top-0 z-[990] flex items-center bg-gray-0/80 px-4 py-4 backdrop-blur-xl dark:bg-gray-50/50 md:px-5 lg:px-6 xl:-ms-1.5 xl:pl-4 2xl:-ms-0 2xl:py-5 2xl:pl-6 3xl:px-8 3xl:pl-6 4xl:px-10 4xl:pl-9'
      }
    >
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={
            <Sidebar className="static w-full xl:p-0 2xl:w-full [&>div]:xl:rounded-none" />
          }
        />
        <Link
          href={'/'}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          <Logo iconOnly={true} />
        </Link>
        <SearchWidget />
      </div>
      <HeaderMenuRight />
    </header>
  );
}
