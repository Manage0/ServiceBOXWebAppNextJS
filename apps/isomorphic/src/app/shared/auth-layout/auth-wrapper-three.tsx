'use client';

import logoImg from '@public/logo.svg';
import Image from 'next/image';
import { Button, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { BsActivity } from 'react-icons/bs';

export default function AuthWrapperThree({
  children,
  title,
  className = '',
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  isSocialLoginActive?: boolean;
  isSignIn?: boolean;
  className?: string;
}) {
  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col justify-center bg-custom-green p-4 md:p-12 lg:p-28">
        <div
          className={cn(
            'mx-auto w-full max-w-md rounded-xl bg-white px-4 py-9 dark:bg-gray-50 sm:px-6 md:max-w-xl md:px-10 md:py-12 lg:max-w-[700px] lg:px-16 xl:rounded-2xl 3xl:rounded-3xl',
            className
          )}
        >
          <div className="flex flex-col items-center">
            <Image
              src={logoImg}
              alt="Isomorphic"
              className="mb-7 mt-[-5%] dark:invert"
            />

            <Title
              as="h2"
              className="mb-7 text-center text-[26px] leading-snug md:text-3xl md:!leading-normal lg:mb-10 lg:text-4xl lg:leading-normal"
            >
              {title}
            </Title>
          </div>
          <>
            <div className="flex flex-col gap-4 pb-6 md:flex-row md:gap-6 md:pb-7">
              <Button className="h-11 w-full" variant="outline">
                <BsActivity className="me-2 h-5 w-5 shrink-0 text-primary" />
                <span className="truncate">
                  Csak ez a gomb maradna az Active Directory-hoz
                </span>
              </Button>
            </div>
          </>
          {children}
        </div>
      </div>
    </>
  );
}
