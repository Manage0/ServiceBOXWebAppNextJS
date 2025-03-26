import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import { PartnerFormTypes } from '@/validators/partner.schema';
import { generateHTML, getCETDate } from '@/utils';

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
    const htmlContent = generateHTML(
      worksheetData,
      companyData,
      partnerData,
      siteData,
      productsData,
      BBOXLOGO
    );

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
