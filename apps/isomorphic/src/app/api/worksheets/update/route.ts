import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

export async function PATCH(req: NextRequest) {
  try {
    const { signage, signage_date, signing_person, id, email } =
      (await req.json()) as Partial<
        Pick<
          WorksheetFormTypes,
          'signage' | 'signage_date' | 'signing_person' | 'id' | 'email'
        >
      >;

    if (!id) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    if (!signage || !signage_date || !signing_person || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE worksheets
      SET signage = $1, signage_date = $2, signing_person = $3
      WHERE id = $4
      RETURNING *;
    `;

    const res = await executeQuery(query, [
      signage,
      signage_date,
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

    // Generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`
      <html>
        <body>
          <h1>Worksheet ${worksheet.id}</h1>
          <p>Signage: ${worksheet.signage}</p>
          <p>Signage Date: ${worksheet.signage_date}</p>
          <p>Signing Person: ${worksheet.signing_person}</p>
        </body>
      </html>
    `);
    const pdfBuffer = Buffer.from(await page.pdf());
    await browser.close();

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Aláírt munkalap',
      text: 'Csatolva küldjük az aláírt munkalapot.',
      attachments: [
        {
          filename: `worksheet-${worksheet.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    transporter.sendMail(mailOptions);

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
