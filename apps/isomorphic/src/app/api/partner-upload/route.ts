import { executeQuery } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Basic Authentication
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii'
  );
  const [username, password] = credentials.split(':');

  if (
    username !== process.env.AUTH_USER ||
    password !== process.env.AUTH_PASS
  ) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Parse JSON body
  const partners = (await req.json()) as Array<{
    id?: number;
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
  }>;

  const errors = [];
  for (let i = 0; i < partners.length; i++) {
    const partner = partners[i];
    try {
      await executeQuery(
        `
          INSERT INTO partners (id, name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            tax_num = EXCLUDED.tax_num,
            contact_person = EXCLUDED.contact_person,
            external_id = EXCLUDED.external_id,
            email = EXCLUDED.email,
            contact_phone_number = EXCLUDED.contact_phone_number,
            country = EXCLUDED.country,
            postal_code = EXCLUDED.postal_code,
            city = EXCLUDED.city,
            address = EXCLUDED.address
        `,
        [
          partner.id || null,
          partner.name,
          partner.tax_num,
          partner.contact_person,
          partner.external_id,
          partner.email,
          partner.contact_phone_number,
          partner.country,
          partner.postal_code,
          partner.city,
          partner.address,
        ]
      );
    } catch (error) {
      errors.push({ index: i, error: (error as Error).message });
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json(
    { message: 'Partners uploaded successfully' },
    { status: 200 }
  );
}
