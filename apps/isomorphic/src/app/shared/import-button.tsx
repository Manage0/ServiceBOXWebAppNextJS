'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { useModal } from '@/app/shared/modal-views/use-modal';
import Image from 'next/image';
import { useRef } from 'react';
import toast from 'react-hot-toast';

const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type ImportButtonProps = {
  title?: string;
  modalBtnLabel?: string;
  className?: string;
  buttonLabel?: string;
};

export default function ImportButton({
  title,
  modalBtnLabel = 'Fájl importálása',
  className,
  buttonLabel = 'Import',
}: React.PropsWithChildren<ImportButtonProps>) {
  const { openModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import-partners-sites', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Az adatokat sikeresen beolvastuk');
      } else {
        const { partnerErrors, siteErrors } = (await res.json()) as {
          partnerErrors: any;
          siteErrors: any;
        };
        toast.error('Failed to import data');
        console.error('Partner Errors:', partnerErrors);
        console.error('Site Errors:', siteErrors);
      }
    } catch (error) {
      toast.error('Failed to import data');
      console.error('Error importing data:', error);
    }
  };

  return (
    <>
      <Button
        onClick={() => fileInputRef.current?.click()}
        className={cn('w-full @lg:w-auto', className)}
      >
        <Image
          src={'/Download.svg'}
          alt="Users icon"
          width={17}
          height={17}
          className="me-1.5"
        />
        {buttonLabel}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleFileChange}
      />
    </>
  );
}
