import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const { email, role_id, surname, forename, userID } =
      (await req.json()) as {
        userID: string;
        email: string;
        role_id: string;
        surname: string;
        forename: string;
      };

    if (!email || !role_id || !surname || !forename || !userID) {
      return NextResponse.json(
        {
          error:
            'All fields (email, role_id, surname, forename, userID) are required',
        },
        { status: 400 }
      );
    }

    // Insert user data into the database
    const res = await executeQuery(
      'INSERT INTO users (email, role_id, surname, forename, id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, role_id, surname, forename, userID]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ userId: res.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
