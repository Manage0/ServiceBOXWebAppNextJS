'use client';

import { useRef, useState } from 'react';
import { Input, Button, Title } from 'rizzui';
import ReactSignatureCanvas from 'react-signature-canvas';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';

interface SignatureModalProps {
  onSave: (signature: string, signingPerson: string) => void;
}

export default function SignatureModal({ onSave }: SignatureModalProps) {
  const sigCanvasRef = useRef<ReactSignatureCanvas | null>(null);
  const [signingPerson, setSigningPerson] = useState('');

  const handleSave = () => {
    if (!sigCanvasRef.current) return;

    const signatureDataUrl = sigCanvasRef.current.toDataURL('image/png');
    if (!signatureDataUrl || sigCanvasRef.current.isEmpty()) {
      toast.error('Kérlek írd alá mentés előtt.');
      return;
    }

    if (!signingPerson) {
      toast.error('Kérlek add meg az aláíró nevét.');
      return;
    }

    onSave(signatureDataUrl, signingPerson);
  };

  const { closeModal: onClose } = useModal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg">
            Aláírás rögzítése
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
        <div className="mb-5">
          Az alábbi szürke mezőbe rögzítsd kérlek az aláírást
        </div>
        <ReactSignatureCanvas
          ref={sigCanvasRef}
          penColor="black"
          canvasProps={{
            className:
              'signatureCanvas w-full h-48 border border-gray-300 bg-gray-100',
          }}
        />
        <Input
          label="Aláíró neve"
          value={signingPerson}
          onChange={(e) => setSigningPerson(e.target.value)}
          className="mt-4"
        />
        <div className="mt-4 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Mégsem
          </Button>
          <Button onClick={handleSave} variant="solid">
            Hozzáadás
          </Button>
        </div>
      </div>
    </div>
  );
}
