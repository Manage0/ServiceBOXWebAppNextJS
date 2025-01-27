import { executeQuery } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const { user_id, email, role_id, surname, forename, profile_picture } =
      (await req.json()) as {
        user_id: string; // The unique identifier for the user
        email: string;
        role_id: number;
        surname: string;
        forename: string;
        profile_picture: string; // Base64 string for the profile_picture image
      };

    if (
      !user_id ||
      !email ||
      !role_id ||
      !surname ||
      !forename ||
      !profile_picture
    ) {
      return NextResponse.json(
        {
          error:
            'All fields (user_id, email, role_id, surname, forename, profile_picture) are required',
        },
        { status: 400 }
      );
    }

    // Update user data in the database
    const res = await executeQuery(
      'UPDATE users SET email = $1, role_id = $2, surname = $3, forename = $4, profile_picture = $5 WHERE id = $6 RETURNING id, email',
      [email, role_id, surname, forename, profile_picture, user_id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'User update failed or user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: {
          id: res.rows[0].id,
          email: res.rows[0].email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
