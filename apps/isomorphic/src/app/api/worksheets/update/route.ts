import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import { PartnerFormTypes } from '@/validators/partner.schema';
import { getCETDate } from '@/utils';

async function fetchWorksheetData(
  id: string
): Promise<WorksheetFormTypes | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/worksheets/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data: WorksheetFormTypes =
    (await res.json()) as unknown as WorksheetFormTypes;
  return data;
}

async function fetchPartnerData(
  partnerId: string
): Promise<PartnerFormTypes | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/partners/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: partnerId }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data: PartnerFormTypes = (await res.json()) as PartnerFormTypes;
  return data;
}

async function fetchLogo(): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/worksheets/logo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { image: string };
  return data.image;
}

async function fetchSiteData(siteId: string): Promise<any | null> {
  if (siteId === 'noid') {
    return undefined;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/sites/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: siteId }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

async function fetchCompanyData(): Promise<any | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/company`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

async function fetchProductsData(worksheet_id: string): Promise<any | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ worksheet_id }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

async function generatePDF(htmlContent: string): Promise<Buffer> {
  console.log('connect');
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  });
  console.log('newPage');
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false); // Disable JavaScript
  console.log('waiting for new page to initialize');
  console.log('setContent');
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle2',
  });
  console.log('pdf');
  const pdfBuffer = await page.pdf();
  console.log('close');
  await browser.close();
  return Buffer.from(pdfBuffer);
}

export async function PATCH(req: NextRequest) {
  try {
    const { signage, signing_person, id, email } =
      (await req.json()) as Partial<
        Pick<WorksheetFormTypes, 'signage' | 'signing_person' | 'id' | 'email'>
      >;

    if (!id) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    if (!signage || !signing_person) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const query = `
    UPDATE worksheets
    SET signage = $1, signage_date = $2, signing_person = $3, status = 'closed'
    WHERE id = $4
    RETURNING *;
  `;

    const res = await executeQuery(query, [
      signage,
      getCETDate(),
      signing_person,
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    const worksheet = res.rows[0];

    // Fetch additional data
    const worksheetData = await fetchWorksheetData(id);
    if (!worksheetData) {
      return NextResponse.json(
        { error: 'Failed to fetch worksheet data' },
        { status: 500 }
      );
    }

    const partnerData = await fetchPartnerData(
      worksheetData.partner_id.toString()
    );
    if (!partnerData) {
      return NextResponse.json(
        { error: 'Failed to fetch partner data' },
        { status: 500 }
      );
    }

    const siteData = await fetchSiteData(
      worksheetData.site_id ? worksheetData.site_id.toString() : 'noid'
    );

    const companyData = await fetchCompanyData();
    if (!companyData) {
      return NextResponse.json(
        { error: 'Failed to fetch company data' },
        { status: 500 }
      );
    }

    const productsData = await fetchProductsData(id);
    if (!productsData) {
      return NextResponse.json(
        { error: 'Failed to fetch products data' },
        { status: 500 }
      );
    }

    const BBOXLOGO = await fetchLogo();
    if (!BBOXLOGO) {
      return NextResponse.json(
        { error: 'Failed to fetch logo' },
        { status: 500 }
      );
    }

    // Generate HTML content for the PDF
    const htmlContent = `
<html>
<head>
  <style>
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
      background-color: #f3f4f6;
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
      background-color: #f3f4f6;
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
  </style>
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
        <span>Bizonylat kelte</span>
        <span>${
          worksheetData.deadline_date
            ? new Date(worksheetData.deadline_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
      <div>
        <span>Vállalási határidő</span>
        <span>${
          worksheetData.deadline_date
            ? new Date(worksheetData.deadline_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
      <div>
        <span>Elkészült</span>
        <span>${
          worksheetData.completion_date
            ? new Date(worksheetData.completion_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
      <div>
        <span>Átadva</span>
        <span>${
          worksheetData.handover_date
            ? new Date(worksheetData.handover_date).toLocaleDateString()
            : 'Nincs adat'
        }</span>
      </div>
    </div>
    <div class="section-title">Javítás</div>
    <div class="work-details">
      <span>Munka megnevezése</span>
      <b>${worksheetData.work_description}</b>
      <span>Szerelő</span>
      <b>${worksheetData.creator_name}</b>
      <span>JIRA Ticket</span>
      <b>${worksheetData.jira_ticket_num || ''}</b>
      <span>Hiba / Munka leírása</span>
      <b>${worksheetData.issue_description}</b>
    </div>
    <div class="times">
      <div>
        <span>Indulás</span>
        <span>${worksheetData.start_time || 'Nincs adat'}</span>
      </div>
      <div>
        <span>Érkezés</span>
        <span>${worksheetData.arrival_time || 'Nincs adat'}</span>
      </div>
      <div>
        <span>Távozás</span>
        <span>${worksheetData.departure_time || 'Nincs adat'}</span>
      </div>
      <div>
        <span>Visszaérkezés</span>
        <span>${worksheetData.rearrival_time || 'Nincs adat'}</span>
      </div>
    </div>
  </div>
  <div class="container page-break">
    <div class="section-title">Felhasznált anyagok, szolgáltatások</div>
    <div class="table-container">
      <table class="table">
        <colgroup>
          <col style="width: 50px;">
          <col style="width: 500px;">
          <col style="width: 100px;">
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>Tétel</th>
            <th>Mennyiség</th>
          </tr>
        </thead>
        <tbody>
          ${
            productsData
              ? productsData
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
        <img src="${signage}" alt="Signature" />
      </div>
      <div class="signature-info">
        <p>Aláírva: ${getCETDate().toLocaleString()}</p>
        <p>Aláíró neve: <span>${signing_person}</span></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(htmlContent);
    } catch (error) {
      console.error('Error generating PDF, retrying...', error);
      pdfBuffer = await generatePDF(htmlContent);
    }

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Email sent to: ' + email || partnerData.email);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email || partnerData.email,
      subject: 'Aláírt munkalap',
      text: 'Csatolva küldjük az aláírt munkalapot.',
      attachments: [
        {
          filename: `${worksheet.worksheet_id}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Worksheet updated and email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating worksheet or sending email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
