'use client';

import { Button } from 'rizzui';
import SimpleBar from '@core/ui/simplebar';
import EnvatoIcon from '@core/components/icons/envato';
import ColorOptions from '@/layouts/settings/color-options';
import AppDirection from '@/layouts/settings/app-direction';
import ThemeSwitcher from '@/layouts/settings/theme-switcher';

export default function SettingsDrawer() {
  return (
    <>
      <SimpleBar className="h-[calc(100%-138px)]">
        <div className="px-5 py-6">
          <ThemeSwitcher />
          <AppDirection />
          <ColorOptions />
        </div>
      </SimpleBar>
    </>
  );
}
