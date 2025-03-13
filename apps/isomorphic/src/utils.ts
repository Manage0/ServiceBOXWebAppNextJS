import toast from 'react-hot-toast';
import { CompanyFormTypes } from './validators/company-info.schema';
import { PartnerOption } from './types';

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
  setSiteOptions: (
    options: { label: string; value: number; partner_id: number }[]
  ) => void
) {
  try {
    const response = await fetch('/api/sites');
    const data = await response.json();

    if ((data as { error?: string }).error) {
      throw new Error((data as { error: string }).error);
    }

    const siteData = data as {
      name: string;
      site_id: number;
      partner_id: number;
    }[];
    const options = siteData.map((site) => ({
      label: site.name,
      value: site.site_id,
      partner_id: site.partner_id,
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
  setPartnerOptions: (options: PartnerOption[]) => void
) {
  try {
    const response = await fetch('/api/partners');
    const data = await response.json();

    const partnerData = data as PartnerOption[];
    const options = partnerData.map((partner) => ({
      ...partner,
      label: partner.name,
      value: Number(partner.id),
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

interface DescriptionTemplateOption {
  id: string;
  name: string;
  issue_description: string;
  work_description: string;
}

export async function fetchDescriptionTemplates(
  setDescriptionTemplates: (
    descriptiontemplates: DescriptionTemplateOption[]
  ) => void
) {
  try {
    const response = await fetch('/api/description_templates');
    const data = await response.json();
    const descriptiontemplateData = data as DescriptionTemplateOption[];
    setDescriptionTemplates(descriptiontemplateData);
  } catch (error) {
    console.error('Error fetching Descriptiontemplates:', error);
    toast.error('Error fetching Descriptiontemplates');
  }
}

interface CommentTemplateOption {
  id: string;
  name: string;
  public_comment: string;
  private_comment: string;
}

export async function fetchCommentTemplates(
  setCommentTemplates: (commentTemplates: CommentTemplateOption[]) => void
) {
  try {
    const response = await fetch('/api/comment_templates');
    const data = await response.json();
    const commentTemplateData = data as CommentTemplateOption[];
    setCommentTemplates(commentTemplateData);
  } catch (error) {
    console.error('Error fetching Comment Templates:', error);
    toast.error('Error fetching Comment Templates');
  }
}

export async function fetchProductOptions(
  setProductOptions: (options: { label: string; value: number }[]) => void
) {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();

    const productData = data as { id: number; name: string }[];

    const options = productData.map((product) => ({
      label: product.name,
      value: product.id,
    }));
    setProductOptions(options);
  } catch (error) {
    console.error('Error fetching product options:', error);
    toast.error('Error fetching product options');
  }
}

export async function fetchProducts(
  setProducts: (
    products: {
      id: number;
      name: string;
      stock: number;
      price: number;
      status: string;
      image?: string;
      category: string;
      measure: string;
    }[]
  ) => void
) {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();

    const productData = data as {
      id: number;
      name: string;
      stock: number;
      price: number;
      status: string;
      image?: string;
      category: string;
      measure: string;
    }[];

    setProducts(productData);
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Error fetching products');
  }
}

export const fetchInitialData = async (
  setSiteOptions: (
    options: { label: string; value: number; partner_id: number }[]
  ) => void,
  setPartnerOptions: (options: PartnerOption[]) => void,
  setAssigneeOptions: (options: { label: string; value: string }[]) => void,
  setWorksheetOptions: (options: { label: string; value: number }[]) => void,
  setCompanyData: (arg0: {
    company_name: string;
    country: string;
    postal_code: string;
    city: string;
    address: string;
    tax_number: string;
    email: string;
    eu_tax_number?: string | undefined;
  }) => void,
  setDescriptionTemplates: (
    descriptiontemplates: DescriptionTemplateOption[]
  ) => void,
  setProducts: (
    products: {
      id: number;
      name: string;
      stock: number;
      price: number;
      status: string;
      image?: string;
      category: string;
      measure: string;
    }[]
  ) => void,
  setProductOptions: (options: { label: string; value: number }[]) => void,
  session: any,
  setUserName: (user: User) => void
) => {
  await Promise.all([
    fetchSiteOptions(setSiteOptions),
    fetchPartnerOptions(setPartnerOptions),
    fetchAssigneeOptions(setAssigneeOptions),
    fetchWorksheetOptions(setWorksheetOptions),
    fetchCompanyData(setCompanyData),
    fetchDescriptionTemplates(setDescriptionTemplates),
    fetchProducts(setProducts),
    fetchProductOptions(setProductOptions),
  ]);

  if (session?.user.id) {
    getName(session.user.id, setUserName);
  }
};

export const handlePartnerChange = (
  selectedPartnerId: number | null,
  siteOptions: any[],
  partnerOptions: PartnerOption[],
  setFilteredSiteOptions: Function,
  setValue: Function
) => {
  if (selectedPartnerId) {
    const filteredSites = siteOptions.filter(
      (site) => site.partner_id === selectedPartnerId
    );
    setFilteredSiteOptions(filteredSites);

    const selectedPartner = partnerOptions.find(
      (option) => option.value === selectedPartnerId
    );
    if (selectedPartner) {
      setValue('tax_num', selectedPartner.tax_num);
      setValue('postal_code', selectedPartner.postal_code);
      setValue('country', selectedPartner.country);
      setValue('city', selectedPartner.city);
      setValue('address', selectedPartner.address);
      setValue('email', selectedPartner.email);
    }
  } else {
    setFilteredSiteOptions([]);
    setValue('tax_num', '');
    setValue('postal_code', '');
    setValue('country', '');
    setValue('city', '');
    setValue('address', '');
    setValue('email', '');
  }
};

export const handleTemplateChange = (
  selectedDescriptionTemplate: any,
  setValue: Function
) => {
  setValue(
    'issue_description',
    selectedDescriptionTemplate?.issue_description || ''
  );
  setValue(
    'work_description',
    selectedDescriptionTemplate?.work_description || ''
  );
};
