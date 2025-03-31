import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import { PartnerFormTypes } from '@/validators/partner.schema';
import { generateHTML, getCETDate } from '@/utils';

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
  const partnerData = partnerRes.ok
    ? ((await partnerRes.json()) as PartnerFormTypes)
    : null;

  if (!partnerData) {
    throw new Error('Partner data is required but was not found.');
  }
  const siteData = siteRes && siteRes.ok ? await siteRes.json() : null;
  const companyData = companyRes.ok ? await companyRes.json() : null;

  return { worksheetData, partnerData, siteData, companyData };
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

    // Update worksheet in the database
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

    // Fetch additional data in parallel
    const { worksheetData, partnerData, siteData, companyData } =
      await fetchDataInParallel(
        id,
        worksheet.partner_id.toString(),
        worksheet.site_id ? worksheet.site_id.toString() : 'noid'
      );

    if (!worksheetData || !partnerData || !companyData) {
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

    // Generate PDF
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
