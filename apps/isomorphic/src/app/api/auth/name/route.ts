import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const { userId }: { userId: string } = (await req.json()) as {
      userId: string;
    };

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const res = await executeQuery(
      'SELECT forename, surname FROM users WHERE id = $1',
      [userId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const record = res.rows[0];

    return NextResponse.json({
      forename: record.forename,
      surname: record.surname,
    });
  } catch (error) {
    console.error('Error fetching user first name:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
