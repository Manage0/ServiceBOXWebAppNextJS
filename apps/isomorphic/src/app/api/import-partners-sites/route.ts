import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  const text = await file.text();
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  const partnerErrors = [];
  const siteErrors = [];

  for (const record of records) {
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
          record.id,
          record.name,
          record.tax_num,
          record.contact_person,
          record.external_id,
          record.email,
          record.contact_phone_number,
          record.country,
          record.postal_code,
          record.city,
          record.address,
        ]
      );
    } catch (error) {
      partnerErrors.push({ record, error: (error as Error).message });
    }

    try {
      await executeQuery(
        `
          INSERT INTO sites (site_id, partner_id, name, external_id, country, postal_code, city, address)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (site_id) DO UPDATE SET
            partner_id = EXCLUDED.partner_id,
            name = EXCLUDED.name,
            external_id = EXCLUDED.external_id,
            country = EXCLUDED.country,
            postal_code = EXCLUDED.postal_code,
            city = EXCLUDED.city,
            address = EXCLUDED.address
        `,
        [
          record.site_id,
          record.partner_id,
          record.site_name,
          record.site_external_id,
          record.site_country,
          record.site_postal_code,
          record.site_city,
          record.site_address,
        ]
      );
    } catch (error) {
      siteErrors.push({ record, error: (error as Error).message });
    }
  }

  if (partnerErrors.length > 0 || siteErrors.length > 0) {
    return NextResponse.json({ partnerErrors, siteErrors }, { status: 400 });
  }

  return NextResponse.json(
    { message: 'Az adatokat sikeresen beolvastuk' },
    { status: 200 }
  );
}
