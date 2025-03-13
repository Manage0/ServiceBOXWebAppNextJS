import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { executeQuery } from '@/db';
import { statusOptions } from '@/app/shared/options';

export async function POST(req: NextRequest) {
  const { userIds, worksheetId, newStatus, changingPerson } =
    (await req.json()) as {
      userIds: string[];
      worksheetId: string;
      newStatus: string;
      changingPerson: string;
    };

  if (!userIds || !worksheetId || !newStatus || !changingPerson) {
    return NextResponse.json(
      {
        message:
          'Missing user IDs, worksheet ID, new status, or changing person',
      },
      { status: 400 }
    );
  }

  try {
    // Fetch emails based on user IDs
    const placeholders = userIds.map((_, index) => `$${index + 1}`).join(',');
    const query = `SELECT email FROM users WHERE id IN (${placeholders})`;
    const result = await executeQuery(query, userIds);

    const emails = result.rows.map((row: { email: string }) => row.email);

    // Filter out the current user
    const filteredEmails = emails.filter((email) => email !== changingPerson);

    if (filteredEmails.length === 0) {
      console.log('No emails to notify after filtering out the current user');
      return NextResponse.json(
        { message: 'No emails to notify after filtering out the current user' },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const newStatusText = statusOptions.find(
      (option) => option.value === newStatus
    )?.label;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: filteredEmails.join(','),
      subject: 'Munkalap státusz változás',
      text: `Szia, a munkalap státusza megváltozott: ${process.env.NEXT_PUBLIC_BASE_URL}/worksheets/${worksheetId}. Az új státusz: ${newStatusText}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Emails sent successfully');
    return NextResponse.json(
      { message: 'Emails sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { message: 'Error sending emails' },
      { status: 500 }
    );
  }
}
