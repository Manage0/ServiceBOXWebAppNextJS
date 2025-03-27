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

    // Fetch emails and site for each partner
    for (const partner of partners) {
      const emailRes = await executeQuery(
        'SELECT email FROM partner_email WHERE partner_id = $1',
        [partner.id]
      );
      partner.emails = emailRes.rows.map((row) => row.email);

      const siteRes = await executeQuery(
        'SELECT site_id, name, external_id, country, postal_code, city, address FROM sites WHERE partner_id = $1',
        [partner.id]
      );
      partner.site = siteRes.rows[0];
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

function formatQuery(query: string, params: any[]): string {
  return query.replace(/\$(\d+)/g, (_, index) => {
    const paramIndex = parseInt(index, 10) - 1;
    return JSON.stringify(params[paramIndex]);
  });
}

async function logAndExecuteQuery(query: string, params: any[]) {
  const formattedQuery = formatQuery(query, params);
  console.log('Executing query:', formattedQuery);
  return executeQuery(query, params);
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
      emails,
      site,
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
      emails: string[];
      site: {
        name: string;
        external_id: string;
        country: string;
        postal_code: string;
        city: string;
        address: string;
      };
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
      !address ||
      !site.name ||
      !site.country ||
      !site.postal_code ||
      !site.city ||
      !site.address
    ) {
      return NextResponse.json(
        {
          error:
            'All fields (name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address, site.name, site.country, site.postal_code, site.city, site.address) are required',
        },
        { status: 400 }
      );
    }

    // Single query to insert partner, emails, and site
    const query = `
      WITH inserted_partner AS (
        INSERT INTO partners (name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      ),
      inserted_emails AS (
        INSERT INTO partner_email (partner_id, email)
        SELECT id, unnest($11::text[])
        FROM inserted_partner
      ),
      inserted_site AS (
        INSERT INTO sites (partner_id, name, external_id, country, postal_code, city, address)
        SELECT id, $12, $13, $14, $15, $16, $17
        FROM inserted_partner
      )
      SELECT id FROM inserted_partner;
    `;

    const values = [
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
      emails, // Array of emails
      site.name,
      site.external_id,
      site.country,
      site.postal_code,
      site.city,
      site.address,
    ];

    const res = await executeQuery(query, values);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Partner creation failed' },
        { status: 500 }
      );
    }

    const partnerId = res.rows[0].id;

    return NextResponse.json({ id: partnerId }, { status: 201 });
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
      emails,
      site,
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
      emails: string[];
      site: {
        name: string;
        external_id: string;
        country: string;
        postal_code: string;
        city: string;
        address: string;
      };
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
      !address ||
      !site.name ||
      !site.country ||
      !site.postal_code ||
      !site.city ||
      !site.address
    ) {
      return NextResponse.json(
        {
          error:
            'All fields (id, name, tax_num, contact_person, external_id, email, contact_phone_number, country, postal_code, city, address, site.name, site.country, site.postal_code, site.city, site.address) are required',
        },
        { status: 400 }
      );
    }

    // Update partner data in the database
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

    // Delete existing emails for the partner
    await executeQuery('DELETE FROM partner_email WHERE partner_id = $1', [id]);

    // Insert new emails into partner_email table
    for (const email of emails) {
      await executeQuery(
        'INSERT INTO partner_email (partner_id, email) VALUES ($1, $2)',
        [id, email]
      );
    }

    // Upsert site data in the sites table
    await executeQuery(
      `
        INSERT INTO sites (partner_id, name, external_id, country, postal_code, city, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (partner_id) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          external_id = EXCLUDED.external_id,
          country = EXCLUDED.country,
          postal_code = EXCLUDED.postal_code,
          city = EXCLUDED.city,
          address = EXCLUDED.address
      `,
      [
        id,
        site.name,
        site.external_id,
        site.country,
        site.postal_code,
        site.city,
        site.address,
      ]
    );

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

    // Delete emails for the partners
    await executeQuery(
      'DELETE FROM partner_email WHERE partner_id = ANY($1::int[])',
      [partner_ids]
    );

    // Delete site data for the partners
    await executeQuery('DELETE FROM sites WHERE partner_id = ANY($1::int[])', [
      partner_ids,
    ]);

    // Delete partner data from the database
    const res = await executeQuery(
      'DELETE FROM partners WHERE id = ANY($1::int[]) RETURNING id',
      [partner_ids]
    );

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
