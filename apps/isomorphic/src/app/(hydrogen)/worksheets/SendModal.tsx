'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Title, Select } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import { fetchPartnerOptions } from '@/utils';
import { PartnerOption } from '@/app/shared/worksheets/create-worksheet';

export default function SendModal() {
  const [signingPerson, setSigningPerson] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [partner, setPartner] = useState<number | undefined>();
  const [partnerOptions, setPartnerOptions] = useState<PartnerOption[]>([]);

  useEffect(() => {
    fetchPartnerOptions(setPartnerOptions).catch((error) => {
      toast.error('Failed to fetch partner options');
      console.error(error);
    });
  }, []);

  const { closeModal: onClose } = useModal();

  const handlePartnerChange = (option: { value: number }) => {
    setPartner(option.value);
    const selectedPartner = partnerOptions.find(
      (p) => p.value === Number(option.value)
    );
    if (selectedPartner) {
      setSigningPerson(selectedPartner.contact_person);
      setEmail(selectedPartner.email);
    }
  };

  const handleSend = () => {
    const selectedPartner = partnerOptions.find(
      (option) => option.value === partner
    )?.label;
    alert(
      `Partner: ${selectedPartner}\nKapcsolattartó: ${signingPerson}\nEmail: ${email}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg font-bold">
            Munkalap aláírásra küldése
          </Title>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <Select
          label="Partner"
          value={partner}
          onChange={handlePartnerChange}
          options={partnerOptions}
          className="mb-4"
          displayValue={(option) =>
            partnerOptions.find((o) => o.value === option)?.label
          }
        />
        <Input
          label="Kapcsolattartó"
          value={signingPerson}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSigningPerson(event.target.value)
          }
          className="mb-4"
        />
        <Input
          label="Email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
          className="mb-4"
        />
        {/*<div className="mb-4">
          <p>
            <strong>Küldés időpont:</strong> 2024.10.02. - 12:54h
          </p>
          <p>
            <strong>Megnyitva:</strong> 2024.10.03 - 08:12h
          </p>
          <p>
            <strong>Aláírás rögzítve:</strong> 2024.10.03 - 08:15h
          </p>
        </div>*/}
        <div className="mt-4 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Mégsem
          </Button>
          <Button onClick={handleSend} variant="solid">
            Küldés
          </Button>
        </div>
      </div>
    </div>
  );
}
