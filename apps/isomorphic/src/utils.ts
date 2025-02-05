import toast from 'react-hot-toast';
import { CompanyFormTypes } from './validators/company-info.schema';

// Fetch company data
export const fetchCompanyData = async (
  setter: (arg0: {
    company_name: string;
    country: string;
    postal_code: string;
    city: string;
    address: string;
    tax_number: string;
    email: string;
    eu_tax_number?: string | undefined;
  }) => void
) => {
  try {
    const res = await fetch('/api/company');
    if (!res.ok) {
      throw new Error('Failed to fetch company data');
    }
    const data: CompanyFormTypes = (await res.json()) as CompanyFormTypes;
    setter(data);
  } catch (error) {
    console.error('Error fetching company data:', error);
    toast.error('Hiba történt a cégadatok betöltésekor.');
  }
};

export interface User {
  forename: string;
  surname: string;
}

export async function getName(userId: string, setter: (user: User) => void) {
  try {
    const res = await fetch('/api/auth/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      const data: User = (await res.json()) as User;
      setter(data);
    } else {
      console.error('Failed to fetch user name:', await res.json());
    }
  } catch (error) {
    console.error('Error fetching user name:', error);
  }
}
