import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface UserRequest {
  user_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const { user_id } = (await req.json()) as UserRequest;
    const res = await executeQuery(
      'SELECT u.id, u.forename, u.surname, u.profile_picture, u.email, u.last_login, u.last_activity, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1;',
      [user_id]
    );

    const users = res.rows;
    if (users.length === 0) {
      return NextResponse.json({ error: 'users not found' }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
