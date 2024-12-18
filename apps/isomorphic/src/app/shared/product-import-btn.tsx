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
};

export default function ProductImportBtn({
  title,
  modalBtnLabel = 'Import File',
  className,
  buttonLabel = 'Import',
}: React.PropsWithChildren<ImportButtonProps>) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <FileUpload
              label={title}
              accept="csv"
              multiple={false}
              btnLabel={modalBtnLabel}
            />
          ),
          customSize: '480px',
        })
      }
      className={cn('w-full @lg:w-auto', className)}
    >
      <Image
        src={'/ProductsBlack.svg'}
        alt="Users icon"
        width={20}
        height={20}
        className="me-1.5"
      />
      {buttonLabel}
    </Button>
  );
}
