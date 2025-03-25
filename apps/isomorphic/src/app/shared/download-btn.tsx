'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import Image from 'next/image';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type ImportButtonProps = {
  title?: string;
  modalBtnLabel?: string;
  className?: string;
  buttonLabel?: string;
  onExport: (invoiceId: number, worksheet_id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  invoiceId: number;
  worksheet_id: string;
};

export default function DownloadBtn({
  title,
  modalBtnLabel = 'Import File',
  className,
  buttonLabel = 'Import',
  onExport,
  size = 'sm',
  invoiceId,
  worksheet_id,
}: React.PropsWithChildren<ImportButtonProps>) {
  const { openModal } = useModal();

  return (
    <Button
      size={size}
      onClick={() => onExport(invoiceId, worksheet_id)}
      className="border-0 border-[1px] border-[#E3E3E3] bg-white text-[#484848] hover:border-[#E3E3E3] hover:bg-gray-100 hover:text-[#484848]"
    >
      <Image
        src={'/Download.svg'}
        alt="Users icon"
        width={17}
        height={17}
        className="me-1.5"
      />
      Letöltés
    </Button>
  );
}
