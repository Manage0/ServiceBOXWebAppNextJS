import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import { generateHTML } from '@/utils';

async function fetchDataInParallel(
  id: string,
  partnerId: string,
  siteId: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const worksheetPromise = fetch(`${baseUrl}/api/worksheets/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  });

  const partnerPromise = fetch(`${baseUrl}/api/partners/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: partnerId }),
    cache: 'no-store',
  });

  const sitePromise =
    siteId !== 'noid'
      ? fetch(`${baseUrl}/api/sites/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: siteId }),
          cache: 'no-store',
        })
      : Promise.resolve(null);

  const companyPromise = fetch(`${baseUrl}/api/company`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const [worksheetRes, partnerRes, siteRes, companyRes] = await Promise.all([
    worksheetPromise,
    partnerPromise,
    sitePromise,
    companyPromise,
  ]);

  const worksheetData = worksheetRes.ok ? await worksheetRes.json() : null;
  const partnerData = partnerRes.ok ? await partnerRes.json() : null;
  const siteData = siteRes && siteRes.ok ? await siteRes.json() : null;
  const companyData = companyRes.ok ? await companyRes.json() : null;

  return {
    worksheetData,
    partnerData,
    siteData,
    companyData,
  };
}

async function generatePDF(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  });

  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false); // Disable JavaScript for faster rendering
  await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

  const pdfBuffer = await page.pdf({ printBackground: true });
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

    // Fetch worksheet data first to get partnerId and siteId
    const worksheetData = (await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/worksheets/get`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        cache: 'no-store',
      }
    ).then((res) => (res.ok ? res.json() : null))) as {
      partner_id: string;
      site_id?: string;
    };

    if (!worksheetData) {
      return NextResponse.json(
        { error: 'Failed to fetch worksheet data' },
        { status: 500 }
      );
    }

    const partnerId = worksheetData.partner_id.toString();
    const siteId = worksheetData.site_id
      ? worksheetData.site_id.toString()
      : 'noid';

    // Fetch additional data in parallel
    const { partnerData, siteData, companyData } = await fetchDataInParallel(
      id,
      partnerId,
      siteId
    );

    if (!partnerData || !companyData) {
      return NextResponse.json(
        { error: 'Failed to fetch required data' },
        { status: 500 }
      );
    }

    // Generate HTML content for the PDF
    const htmlContent = generateHTML(
      worksheetData,
      companyData,
      partnerData,
      siteData
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
