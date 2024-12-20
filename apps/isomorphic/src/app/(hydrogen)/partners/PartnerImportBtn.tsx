import React from 'react';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';

const PartnersImportBtn = () => {
  return (
    <Link href={routes.partners.add} className="w-full @lg:w-auto">
      <Button as="span" className="w-full @lg:w-auto">
        <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
        Új partner
      </Button>
    </Link>
  );
};

export default PartnersImportBtn;
