"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FieldError, Loader, Text } from "rizzui";
import cn from "../../utils/class-names";
import { PiPencilSimple } from "react-icons/pi";
import UploadIcon from "../../components/shape/upload";

interface UploadZoneProps {
  name: string;
  getValues?: any;
  setValue?: any;
  className?: string;
  error?: string;
}

export default function AvatarUpload({
  name,
  error,
  className,
  getValues,
  setValue,
}: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);

  // Get the form value as a string
  const formValue = getValues(name) ?? "";

  // Handle file drop and convert files to Base64 if necessary
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);

      // Convert the first accepted file to Base64
      if (acceptedFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          if (setValue) setValue(name, base64); // Save Base64 as the form value
          toast.success(
            <Text as="b" className="font-semibold">
              Profilkép feltöltve
            </Text>
          );
        };
        reader.readAsDataURL(acceptedFiles[0]);
      }
    },
    [setValue, name]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div className={cn("grid gap-4", className)}>
      <div
        className={cn(
          "relative grid h-[7rem] w-[7rem] place-content-center rounded-full border-[1.8px]"
        )}
      >
        {formValue ? (
          <>
            <figure className="absolute inset-0 rounded-full">
              <Image
                fill
                alt="user avatar"
                src={formValue}
                className="rounded-full"
              />
            </figure>
            <div
              {...getRootProps()}
              className={cn(
                "absolute inset-0 grid place-content-center rounded-full bg-black/70"
              )}
            >
              <PiPencilSimple className="h-5 w-5 text-white" />
              <input {...getInputProps()} />
            </div>
          </>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "absolute inset-0 z-10 grid cursor-pointer place-content-center"
            )}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12" />
            <Text className="text-[10px] align-middle text-center text-gray-500">
              Húzd ide a fájlt, vagy kattints
            </Text>
          </div>
        )}
      </div>
      {error && <FieldError error={error} />}
    </div>
  );
}
