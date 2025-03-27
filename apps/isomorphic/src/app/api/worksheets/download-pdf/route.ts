import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';
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
    return null;
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
  const pdfBuffer = await page.pdf({ printBackground: true });
  console.log('close');
  await browser.close();
  return Buffer.from(pdfBuffer);
}

export async function POST(req: NextRequest) {
  try {
    const { id } = (await req.json()) as Partial<
      Pick<WorksheetFormTypes, 'id'>
    >;

    if (!id) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

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
      BBOXLOGO
    );

    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(htmlContent);
    } catch (error) {
      console.error('Error generating PDF, retrying...', error);
      pdfBuffer = await generatePDF(htmlContent);
    }

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="worksheet-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating downloadable pdf:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
