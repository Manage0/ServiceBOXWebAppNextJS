import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function GET(req: NextRequest) {
  try {
    const res = await executeQuery('SELECT id, name FROM roles');

    const roles = res.rows;

    if (roles.length === 0) {
      return NextResponse.json({ error: 'Roles not found' }, { status: 404 });
    }

    return NextResponse.json(
      roles.map((role) => ({
        value: role.id,
        label: role.name,
      }))
    );
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
