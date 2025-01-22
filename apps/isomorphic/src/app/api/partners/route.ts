import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      tax_num,
      contact_person,
      external_id,
      email,
      contact_phone_number,
      country,
      postal_code,
      city,
      address,
    } = (await req.json()) as {
      name: string;
      tax_num: string;
      contact_person: string;
      external_id: string;
      email: string;
      contact_phone_number: string;
      country: string;
      postal_code: string;
      city: string;
      address: string;
    };

    if (
      !name ||
      !tax_num ||
      !contact_person ||
      !external_id ||
      !email ||
      !contact_phone_number ||
      !country ||
      !postal_code ||
      !city ||
      !address
    ) {
      return NextResponse.json(
        {
          error:
            'All fields (name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address) are required',
        },
        { status: 400 }
      );
    }

    // Construct the query string with values for logging
    const queryString = `
      INSERT INTO partners (name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address)
      VALUES ('${name}', '${tax_num}', '${contact_person}', '${external_id}', '${email}', '${contact_phone_number}', '${country}', '${postal_code}', '${city}', '${address}')
      RETURNING id;
    `;
    console.log('Executing query:', queryString);

    // Insert partner data into the database
    const res = await executeQuery(queryString);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Partner creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: res.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
