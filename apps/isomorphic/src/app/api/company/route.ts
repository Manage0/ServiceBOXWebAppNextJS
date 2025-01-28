import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function GET() {
  try {
    const res = await executeQuery(
      'SELECT company_name, country, postal_code, city, address, tax_number, eu_tax_number, email FROM company LIMIT 1;'
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      company_name,
      country,
      postal_code,
      city,
      address,
      tax_number,
      eu_tax_number,
      email,
    } = (await req.json()) as {
      company_name: string;
      country: string;
      postal_code: string;
      city: string;
      address: string;
      tax_number: string;
      eu_tax_number: string;
      email: string;
    };

    if (
      !company_name ||
      !country ||
      !postal_code ||
      !city ||
      !address ||
      !tax_number ||
      !eu_tax_number ||
      !email
    ) {
      return NextResponse.json(
        {
          error:
            'All fields (company_name, country, postal_code, city, address, tax_number, eu_tax_number, email) are required',
        },
        { status: 400 }
      );
    }

    const queryString = `
    UPDATE company
    SET company_name = $1, country = $2, postal_code = $3, city = $4, address = $5, tax_number = $6, eu_tax_number = $7, email = $8
    RETURNING id;
  `;
    console.log('Executing query:', queryString);

    const res = await executeQuery(queryString, [
      company_name,
      country,
      postal_code,
      city,
      address,
      tax_number,
      eu_tax_number,
      email,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company update failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: res.rows[0].id }, { status: 200 });
  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
