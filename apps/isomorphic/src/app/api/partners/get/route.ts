import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const { id }: { id: string } = (await req.json()) as { id: string };

    if (!id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    const res = await executeQuery(
      'SELECT id, name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address FROM partners WHERE id = $1',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
