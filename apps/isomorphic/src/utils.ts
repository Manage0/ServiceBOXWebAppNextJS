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

export function getCETDate() {
  const now = new Date();
  const cetDate = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })
  );
  return cetDate;
}

export const handleDate = (date: any) =>
  new Date(date).getTime() === 0 ? null : new Date(date);

export const handleDownloadPDF = async (
  invoiceId: number,
  worksheet_id: string
) => {
  if (!invoiceId) return;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/worksheets/download-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: invoiceId }),
    });

    if (!res.ok) {
      throw new Error('Hiba a PDF letöltése közben');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${worksheet_id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('PDF sikeresen letöltve');
  } catch (error) {
    console.error(error);
    toast.error('Hiba a PDF letöltése közben');
  }
};

export function generateHTML(
  worksheetData: any,
  companyData: any,
  partnerData: any,
  siteData: any,
  BBOXLOGO: string
) {
  console.log(worksheetData.devices);
  return `
  <html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <style>
    * {
      font-family: 'Inter', sans-serif;
    }
    .font-medium {
        font-weight: 500;
    }
    .container {
      width: 95%;
              border-radius: 1rem;
        border: 1px solid #d1d5db;
      padding: 1.25rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .header img {
      width: 120px;
      height: 40px;
    }
    .header-title {
      font-family: 'Lexend', sans-serif;
      text-align: center;
      font-size: 1.875rem;
      font-weight: bold;
      color: #25282B;
    }
    .header-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 0;
    }
    .header-info h6 {
      font-size: 1rem;
      font-weight: bold;
      margin: 0;
    }
    .header-info p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 1rem;
    }
    .grid-item {
      margin-top: 1rem;
    }
    .grid-item h6 {
      font-size: 1rem;
      margin-bottom: 0.875rem;
      font-weight: 600;
    }
    .grid-item p {
      font-size: 0.875rem;
      margin-bottom: 0.375rem;
    }
    .grid-item p.uppercase {
      text-transform: uppercase;
      font-weight: 600;
    }
    .dates {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      background-color: #f1f1f1;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
      margin-bottom: 1rem;
    }
    .dates div {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 1px solid #d1d5db;
      padding: 0.5rem;
    }
    .dates div:last-child {
      border-right: none;
    }
    .dates span {
      font-weight: 500;
    }
    .section-title {
      margin-bottom: 2rem;
      margin-left: 4rem;
      text-align: left;
      font-family: 'Lexend', sans-serif;
      font-size: 1.875rem;
      font-weight: bold;
      color: #333333;
    }
    .work-details {
      display: grid;
      grid-template-columns: 30% 70%;
      gap: 1rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .work-details span {
      font-weight: 500;
    }
    .work-details b {
      font-weight: bold;
    }
    .times {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      background-color: #f1f1f1;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
      margin-bottom: 1rem;
    }
    .times div {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 1px solid #d1d5db;
      padding: 0.5rem;
    }
    .times div:last-child {
      border-right: none;
    }
    .times span {
      font-weight: 500;
    }
    .table-container {
      overflow-x: auto;
      margin-bottom: 2.75rem;
    }
    .table {
      width: 100%;
      min-width: 100%;
      table-layout: auto;
      border-collapse: collapse;
    }
    .table th,
    .table td {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
    }
    .table th {
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      background-color: #f3f4f6;
    }
    .table td {
      font-size: 0.875rem;
    }
    .table td h6 {
      margin-bottom: 0.125rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .table td p {
      font-size: 0.875rem;
      color: #6b7280;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #table-no-borders th, td {
        text-align: left;
        border: none !important;
    }
    .notes {
      margin-bottom: 2rem;
      margin-right: 4rem;
      padding-right: 1rem;
    }
    .notes h6 {
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .notes p {
      font-size: 0.875rem;
      margin-left: 4rem;
      line-height: 1.7;
    }
    .signature {
      display: flex;
      flex-direction: column-reverse;
      align-items: flex-start;
      justify-content: space-between;
      border-top: 1px solid #d1d5db;
      padding-top: 2rem;
      padding-bottom: 1rem;
    }
    .signature div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 5rem;
    }
    .signature img {
      width: 100%;
      height: auto;
      background-color: #f3f4f6;
      padding: 1rem;
    }
    .signature-info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 0.875rem;
      color: #6b7280;
    }
    .signature-info p {
      margin: 0;
    }
    .signature-info span {
      font-weight: bold;
    }
    .page-break {
      page-break-before: always;
               margin-top: 2rem;
    }
    .table-header-gray{
      background-color: #f1f1f1;
    }
  </style>
  <meta charset="UTF-8">
</head>
<body>
  <div class="container">
    <div class="header">
      <img alt="BBOX logo" src="${BBOXLOGO}">
      <div class="header-title">Munkalap</div>
      <div class="header-info">
        <h6>${worksheetData.worksheet_id}</h6>
        <p>Bizonylatszám</p>
      </div>
    </div>
    <div class="grid">
      <div class="grid-item">
        <h6>Kiállító</h6>
        <p class="uppercase">${companyData.company_name}</p>
        <p>${companyData.address}</p>
        <p>${companyData.city}</p>
        <p>${companyData.postal_code}</p>
        <p>${companyData.tax_number}</p>
      </div>
      <div class="grid-item">
        <h6>Partner</h6>
        <p class="uppercase">${partnerData.name}</p>
        <p>${partnerData.address}</p>
        <p>${partnerData.city}</p>
        <p>${partnerData.postal_code}</p>
        <p>${partnerData.tax_num}</p>
      </div>
      <div class="grid-item">
        ${
          siteData
            ? `
              <h6>Telephely</h6>
              <p class="uppercase">${siteData.name}</p>
              <p>${siteData.address}</p>
              <p>${siteData.city}</p>
              <p>${siteData.postal_code}</p>
            `
            : ''
        }
      </div>
    </div>
    <div class="dates">
      <div>
        <span class="font-medium">Bizonylat kelte</span>
        <span>${
          worksheetData.deadline_date
            ? new Date(worksheetData.deadline_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
      <div>
        <span class="font-medium">Vállalási határidő</span>
        <span>${
          worksheetData.deadline_date
            ? new Date(worksheetData.deadline_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
      <div>
        <span class="font-medium">Elkészült</span>
        <span>${
          worksheetData.completion_date
            ? new Date(worksheetData.completion_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
      <div>
        <span class="font-medium">Átadva</span>
        <span>${
          worksheetData.handover_date
            ? new Date(worksheetData.handover_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
    </div>
    <div class="section-title">Javítás</div>
    <div class="work-details">
      ${worksheetData?.devices.map((device: any) => `<span>Eszköz neve</span><b>${device.device_id}</b><span>Eszköz azonosító</span><b>${device.name}</b>`).join('')}
      <span>Munka megnevezése</span>
      <b>${worksheetData.work_description || ''}</b>
      <span>Szerelő</span>
      <b>${worksheetData.creator_name}</b>
      <span>JIRA Ticket</span>
      <b>${worksheetData.jira_ticket_num || ''}</b>
      <span>Hiba / Munka leírása</span>
      <b>${worksheetData.issue_description || ''}</b>
    </div>
    <div class="times">
      <div>
        <span class="font-medium">Indulás</span>
        <span>${worksheetData.start_time || 'Nincs adat'}</span>
      </div>
      <div>
        <span class="font-medium">Érkezés</span>
        <span>${worksheetData.arrival_time || 'Nincs adat'}</span>
      </div>
      <div>
        <span class="font-medium">Távozás</span>
        <span>${worksheetData.departure_time || 'Nincs adat'}</span>
      </div>
      <div>
        <span class="font-medium">Visszaérkezés</span>
        <span>${worksheetData.rearrival_time || 'Nincs adat'}</span>
      </div>
    </div>
  </div>
  <div class="container page-break">
    <div class="section-title">Felhasznált anyagok, szolgáltatások</div>
    <div class="table-container">
      <table id="table-no-borders" class="table">
        <colgroup>
          <col style="width: 50px;">
          <col style="width: 500px;">
          <col style="width: 100px;">
        </colgroup>
        <thead class="table-header-gray">
          <tr>
            <th>#</th>
            <th>Tétel</th>
            <th>Mennyiség</th>
          </tr>
        </thead>
        <tbody>
          ${
            worksheetData.products
              ? worksheetData.products
                  .map(
                    (
                      product: {
                        product_name: string;
                        public_comment: string;
                        amount: number;
                      },
                      index: number
                    ) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <h6>${product.product_name}</h6>
                    <p>${product.public_comment}</p>
                  </td>
                  <td>${product.amount}</td>
                </tr>
              `
                  )
                  .join('')
              : ''
          }
        </tbody>
      </table>
    </div>
    <div class="notes">
      <h6>Megjegyzés</h6>
      <p>${worksheetData.public_comment}</p>
    </div>
    <div class="signature">
      <div>
        <img src="${worksheetData.signage}" alt="Signature" />
      </div>
      <div class="signature-info">
        <p>Aláírva: ${getCETDate().toLocaleString()}</p>
        <p>Aláíró neve: <span><b>${worksheetData.signing_person}</b></span></p>
      </div>
    </div>
  </div>
</body>
</html>
      `;
}
