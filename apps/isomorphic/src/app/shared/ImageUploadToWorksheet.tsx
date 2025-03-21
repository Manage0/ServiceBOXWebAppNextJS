'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { PiTrashBold, PiXBold } from 'react-icons/pi';
import { ActionIcon, Title, Text, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import Upload from '@core/ui/upload';
import { useModal } from '@/app/shared/modal-views/use-modal';
import SimpleBar from '@core/ui/simplebar';
import { toast } from 'react-hot-toast';

export default function FileUpload({
  label = 'Upload Images',
  btnLabel = 'Save Temporarily',
  fieldLabel,
  multiple = true,
  accept = 'img',
  onImagesUploaded,
}: {
  label?: string;
  fieldLabel?: string;
  btnLabel?: string;
  multiple?: boolean;
  accept?: 'img';
  onImagesUploaded: (images: File[]) => void; // Callback to pass files to the parent component
}) {
  const { closeModal } = useModal();
  const [files, setFiles] = useState<Array<File>>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  function handleFileDrop(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFiles = (event.target as HTMLInputElement).files;
    const newFiles = Object.entries(uploadedFiles as object)
      .map((file) => {
        if (file[1]) return file[1];
      })
      .filter((file) => file !== undefined);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }

  function handleImageDelete(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    (imageRef.current as HTMLInputElement).value = '';
  }

  function handleSaveTemporarily() {
    if (files.length) {
      toast.success(<Text as="b">Images saved temporarily</Text>);
      onImagesUploaded(files); // Pass files to the parent component
      setFiles([]); // Clear local files
      closeModal();
    } else {
      toast.error(<Text as="b">Please upload at least one image</Text>);
    }
  }

  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      <div className="mb-6 flex items-center justify-between">
        <Title as="h3" className="text-lg">
          {label}
        </Title>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
      </div>

      <Upload
        label={fieldLabel}
        ref={imageRef}
        accept={accept}
        multiple={multiple}
        onChange={(event) => handleFileDrop(event)}
        className="mb-6 min-h-[50px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
      />

      {files.length > 1 ? (
        <Text className="mb-2 text-gray-500">{files.length} files</Text>
      ) : null}

      {files.length > 0 && (
        <SimpleBar className="max-h-[280px]">
          <div className="grid grid-cols-1 gap-4">
            {files?.map((file: File, index: number) => (
              <div
                className="flex min-h-[58px] w-full items-center rounded-xl border border-muted px-3 dark:border-gray-300"
                key={file.name}
              >
                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                  {file.type.includes('image') && (
                    <Image
                      src={URL.createObjectURL(file)}
                      fill
                      className="object-contain"
                      priority
                      alt={file.name}
                      sizes="(max-width: 768px) 100vw"
                    />
                  )}
                </div>
                <div className="truncate px-2.5">{file.name}</div>
                <ActionIcon
                  onClick={() => handleImageDelete(index)}
                  size="sm"
                  variant="flat"
                  color="danger"
                  className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                >
                  <PiTrashBold className="w-6" />
                </ActionIcon>
              </div>
            ))}
          </div>
        </SimpleBar>
      )}
      <div className="mt-4 flex justify-end gap-3">
        <Button
          variant="outline"
          className={cn(!files.length && 'hidden', 'w-full')}
          onClick={() => setFiles([])}
        >
          Reset
        </Button>
        <Button className="w-full" onClick={() => handleSaveTemporarily()}>
          {btnLabel}
        </Button>
      </div>
    </div>
  );
}
