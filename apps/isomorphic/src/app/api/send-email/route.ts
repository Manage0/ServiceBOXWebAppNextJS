import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { email, worksheetId, signingPerson } = (await req.json()) as {
    email: string;
    worksheetId: string;
    signingPerson: string;
  };

  if (!email || !worksheetId || !signingPerson) {
    return NextResponse.json(
      { message: 'Missing email, worksheet ID, or signing person' },
      { status: 400 }
    );
  }

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
    subject: 'Munkalap aláírásra',
    text: `Szia, légyszi írd alá a munkalapot: ${process.env.NEXT_PUBLIC_BASE_URL}/public/${worksheetId}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Update the signing_person and status on the worksheet
    const updateQuery = `
      UPDATE worksheets
      SET signing_person = $1, status = $2
      WHERE id = $3
    `;
    await executeQuery(updateQuery, [
      signingPerson,
      'outforsignature',
      worksheetId,
    ]);

    return NextResponse.json(
      {
        message:
          'Email sent, signing person updated, and status set to "outforsignature" successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email or updating worksheet:', error);
    return NextResponse.json(
      { message: 'Error sending email or updating worksheet' },
      { status: 500 }
    );
  }
}
