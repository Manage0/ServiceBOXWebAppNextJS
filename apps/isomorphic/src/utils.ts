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
