import { metaObject } from '@/config/site.config';
import PartnersPageHeader from '../../page-header';
import AddPartnerView from '@/app/shared/partners/AddPartnerView';
import { PartnerType } from '@/data/partners-data';
import { notFound } from 'next/navigation';

export const metadata = {
  ...metaObject('Partnerek'),
};

async function fetchPartnerData(id: string): Promise<PartnerType | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Define this in your environment variables
  const res = await fetch(`${baseUrl}/api/partners/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data as PartnerType;
}

export default async function PartnersPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const partnerData = await fetchPartnerData(id);
  if (!partnerData) {
    notFound();
  }

  return (
    <>
      <PartnersPageHeader name="Szerkesztés" />
      <AddPartnerView partnerData={partnerData} />
    </>
  );
}
