import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { email, worksheetId } = (await req.json()) as {
    email: string;
    worksheetId: string;
  };

  if (!email || !worksheetId) {
    return NextResponse.json(
      { message: 'Missing email or worksheet ID' },
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
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email' },
      { status: 500 }
    );
  }
}
