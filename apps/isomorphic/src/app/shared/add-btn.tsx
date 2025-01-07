import React from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';

interface AddBtnProps {
  onClick: () => void;
}

const AddBtn: React.FC<AddBtnProps> = ({ onClick }) => {
  return (
    <Button
      className="w-full max-w-[150px] border-gray-300 bg-white text-black hover:bg-gray-100 @lg:w-auto"
      onClick={onClick}
    >
      <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
      Hozzáad
    </Button>
  );
};

export default AddBtn;
