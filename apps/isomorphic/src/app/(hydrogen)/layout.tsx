'use client';

import { useIsMounted } from '@core/hooks/use-is-mounted';
import HeliumLayout from '@/layouts/helium/helium-layout';

type LayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: LayoutProps) {
  return <LayoutProvider>{children}</LayoutProvider>;
}

function LayoutProvider({ children }: LayoutProps) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }
  return <HeliumLayout>{children}</HeliumLayout>;
}
