import cn from '@core/utils/class-names';
import React from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import Link from 'next/link';

interface AddBtnProps {
  onClick?: () => void;
  variant?: 'gray' | 'colored';
  text?: string;
  href?: string;
  className?: string;
  style?: { [key: string]: string };
}

const AddBtn: React.FC<AddBtnProps> = ({
  onClick = () => {},
  variant = 'colored',
  text = 'Hozzáad',
  href,
  style = {},
  className = '',
}) => {
  const button = (
    <Button
      style={style}
      className={cn(
        'w-full max-w-[150px] @lg:w-auto',
        variant === 'gray' &&
          'border-gray-300 bg-white text-black hover:bg-gray-100',
        className
      )}
      onClick={onClick}
    >
      <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
      {text}
    </Button>
  );

  return href ? <Link href={href}>{button}</Link> : button;
};

export default AddBtn;
