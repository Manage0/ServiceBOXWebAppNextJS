import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function GET() {
  try {
    const res = await executeQuery(
      'SELECT id, name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address FROM partners;'
    );

    const partners = res.rows;
    if (partners.length === 0) {
      return NextResponse.json(
        { error: 'partners not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
