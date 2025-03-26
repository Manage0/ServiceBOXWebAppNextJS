import cn from '@core/utils/class-names';
import React, { ReactNode } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import Link from 'next/link';
import { useModal } from './modal-views/use-modal';

interface AddBtnProps {
  onClick?: () => void;
  variant?: 'gray' | 'colored';
  text?: string;
  href?: string;
  className?: string;
  style?: { [key: string]: string };
  modalView?: ReactNode;
}

const AddBtn: React.FC<AddBtnProps> = ({
  onClick = () => {},
  variant = 'colored',
  text = 'Hozzáad',
  href,
  style = {},
  className = '',
  modalView,
}) => {
  const { openModal } = useModal();
  const button = (
    <Button
      style={style}
      className={
        href
          ? 'w-full'
          : cn(
              'w-full @lg:w-auto @lg:max-w-[150px]',
              variant === 'gray' &&
                'border-gray-300 bg-white text-black hover:bg-gray-100',
              className
            )
      }
      onClick={modalView ? () => openModal({ view: modalView }) : onClick}
    >
      <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
      {text}
    </Button>
  );

  return href ? (
    <Link
      href={href}
      className={cn(
        'w-full @lg:w-auto @lg:max-w-[150px]',
        variant === 'gray' &&
          'border-gray-300 bg-white text-black hover:bg-gray-100',
        className
      )}
    >
      {button}
    </Link>
  ) : (
    button
  );
};

export default AddBtn;
