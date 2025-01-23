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

export async function PUT(req: NextRequest) {
  try {
    const {
      id,
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
      id: string;
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
      !id ||
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
            'All fields (id, name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address) are required',
        },
        { status: 400 }
      );
    }

    const queryString = `
      UPDATE partners
      SET name = '${name}', tax_num = '${tax_num}', contact_person = '${contact_person}', external_id = '${external_id}', email = '${email}', contact_phone_number = '${contact_phone_number}', country = '${country}', postal_code = '${postal_code}', city = '${city}', address = '${address}'
      WHERE id = '${id}'
      RETURNING id;
    `;
    console.log('Executing query:', queryString);

    const res = await executeQuery(
      'UPDATE partners SET name = $1, tax_num = $2, contact_person = $3, external_id = $4, email = $5, contact_phone_number = $6, country = $7, postal_code = $8, city = $9, address = $10 WHERE id = $11 RETURNING id',
      [
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
        id,
      ]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Partner update failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: res.rows[0].id }, { status: 200 });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { partner_ids } = (await req.json()) as { partner_ids: string[] };

    if (!partner_ids || partner_ids.length === 0) {
      return NextResponse.json(
        { error: 'No partner IDs provided' },
        { status: 400 }
      );
    }

    // Construct the query string with values for logging
    const queryString = `
      DELETE FROM partners
      WHERE id = ANY($1::int[])
      RETURNING id;
    `;
    console.log('Executing query:', queryString);

    // Delete partner data from the database
    const res = await executeQuery(queryString, [partner_ids]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Partner deletion failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { deletedIds: res.rows.map((row) => row.id) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting partners:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
