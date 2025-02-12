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

export async function fetchSiteOptions(
  setSiteOptions: (options: { label: string; value: number }[]) => void
) {
  try {
    const response = await fetch('/api/sites');
    const data = await response.json();

    if ((data as { error?: string }).error) {
      throw new Error((data as { error: string }).error);
    }

    const siteData = data as { name: string; site_id: number }[];
    const options = siteData.map((site) => ({
      label: site.name,
      value: site.site_id,
    }));
    setSiteOptions(options);
  } catch (error) {
    console.error('Error fetching site options:', error);
    if (error instanceof Error) {
      toast.error('Hiba a telephelyek betöltése során: ' + error.message);
    } else {
      toast.error('Hiba a telephelyek betöltése során');
    }
  }
}

export async function fetchPartnerOptions(
  setPartnerOptions: (options: { label: string; value: number }[]) => void
) {
  try {
    const response = await fetch('/api/partners');
    const data = await response.json();

    const partnerData = data as { name: string; id: number }[];
    const options = partnerData.map((partner) => ({
      label: partner.name,
      value: partner.id,
    }));
    setPartnerOptions(options);
  } catch (error) {
    console.error('Error fetching partner options:', error);
    toast.error('Error fetching partner options');
  }
}

export async function fetchAssigneeOptions(
  setAssigneeOptions: (options: { label: string; value: string }[]) => void
) {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();

    const userData = data as {
      id: string;
      surname: string;
      forename: string;
    }[];
    const options = userData.map((user) => ({
      label: user.surname + ' ' + user.forename,
      value: user.id,
    }));
    setAssigneeOptions(options);
  } catch (error) {
    console.error('Error fetching assignee options:', error);
    toast.error('Error fetching assignee options');
  }
}

export async function fetchWorksheetOptions(
  setWorksheetOptions: (options: { label: string; value: number }[]) => void
) {
  try {
    const response = await fetch('/api/worksheets');
    const data = await response.json();

    const worksheetData = data as { id: number; worksheet_id: string }[];
    const options = worksheetData.map((worksheet) => ({
      label: worksheet.worksheet_id,
      value: worksheet.id,
    }));
    setWorksheetOptions(options);
  } catch (error) {
    console.error('Error fetching worksheet options:', error);
    toast.error('Error fetching worksheet options');
  }
}
