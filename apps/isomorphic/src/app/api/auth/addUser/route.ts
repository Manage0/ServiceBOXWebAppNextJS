import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const { email, role_id, surname, forename, id } = (await req.json()) as {
      id: string;
      email: string;
      role_id: string;
      surname: string;
      forename: string;
    };

    if (!email || !role_id || !surname || !forename || !id) {
      return NextResponse.json(
        {
          error:
            'All fields (email, role_id, surname, forename, id) are required',
        },
        { status: 400 }
      );
    }

    // Insert user data into the database
    const res = await executeQuery(
      'INSERT INTO users (email, role_id, surname, forename, id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, role_id, surname, forename, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: res.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { email, role_id, surname, forename, id } = (await req.json()) as {
      id: string;
      email: string;
      role_id: string;
      surname: string;
      forename: string;
    };

    if (!email || !role_id || !surname || !forename || !id) {
      return NextResponse.json(
        {
          error:
            'All fields (email, role_id, surname, forename, id) are required',
        },
        { status: 400 }
      );
    }

    // Update user data in the database
    const res = await executeQuery(
      'UPDATE users SET email = $1, role_id = $2, surname = $3, forename = $4 WHERE id = $5 RETURNING id',
      [email, role_id, surname, forename, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'User update failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: res.rows[0].id }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
