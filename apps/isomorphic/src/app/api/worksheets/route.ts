import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';
import { getCETDate } from '@/utils';

export async function GET() {
  try {
    const query = `
      SELECT 
        w.*, 
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'user_id', a.user_id,
              'full_name', CONCAT(u.forename, ' ', u.surname),
              'seen', a.seen
            )
          ) FILTER (WHERE a.user_id IS NOT NULL), 
          '[]'
        ) AS assignees
      FROM worksheets w
      LEFT JOIN ws_assignees a ON w.id = a.wsid
      LEFT JOIN users u ON a.user_id = u.id
      GROUP BY w.id
      ORDER BY w.worksheet_id DESC;
    `;

    const res = await executeQuery(query);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'No worksheets found' },
        { status: 404 }
      );
    }

    // Return the result directly without unnecessary transformations
    return NextResponse.json(res.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching worksheets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as WorksheetFormTypes;

    const {
      completion_date,
      handover_date,
      priority,
      status,
      invoice_date,
      deadline_date,
      country,
      postal_code,
      city,
      address,
      tax_num,
      email,
      worksheet_id,
      partner_name,
      company_name,
      company_address,
      company_tax_num,
      creator_name,
      jira_ticket_num,
      invoice_number,
      procurement_po,
      issue_description,
      work_description,
      public_comment,
      private_comment,
      partner_id,
      site_id,
      start_time,
      arrival_time,
      departure_time,
      rearrival_time,
      assignees,
      devices,
      products,
      received_accessories,
    } = data;

    if (!partner_id) {
      throw new Error('partner_id is required');
    }

    // Single query to insert worksheet and related data
    const query = `
      WITH inserted_worksheet AS (
        INSERT INTO worksheets (
          completion_date,
          handover_date,
          priority,
          creation_date,
          status,
          invoice_date,
          deadline_date,
          country,
          postal_code,
          city,
          address,
          tax_num,
          email,
          worksheet_id,
          partner_name,
          company_name,
          company_address,
          company_tax_num,
          creator_name,
          jira_ticket_num,
          invoice_number,
          procurement_po,
          issue_description,
          work_description,
          public_comment,
          private_comment,
          partner_id,
          site_id,
          start_time,
          arrival_time,
          departure_time,
          rearrival_time,
          received_accessories
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
        ) RETURNING id
      ),
      inserted_assignees AS (
        INSERT INTO ws_assignees (wsid, seen, user_id)
        SELECT id, false, unnest($34::text[])
        FROM inserted_worksheet
      ),
      inserted_devices AS (
        INSERT INTO ws_device (wsid, device_id, device_name)
        SELECT id, unnest($35::text[]), unnest($36::text[])
        FROM inserted_worksheet
      ),
      inserted_products AS (
        INSERT INTO ws_product (
          wsid,
          amount,
          private_comment,
          product_name,
          measure,
          public_comment
        )
        SELECT 
          id,
          unnest($37::int[]),
          unnest($38::text[]),
          unnest($39::text[]),
          unnest($40::text[]),
          unnest($41::text[])
        FROM inserted_worksheet
      )
      SELECT id FROM inserted_worksheet;
    `;

    // Prepare values for the query
    const values = [
      completion_date || null,
      handover_date || null,
      priority,
      getCETDate(),
      status,
      invoice_date,
      deadline_date || null,
      country,
      postal_code,
      city,
      address,
      tax_num,
      email,
      worksheet_id,
      partner_name,
      company_name,
      company_address,
      company_tax_num,
      creator_name,
      jira_ticket_num || '',
      invoice_number || '',
      procurement_po || '',
      issue_description || '',
      work_description || '',
      public_comment || '',
      private_comment || '',
      partner_id,
      site_id || null,
      start_time || null,
      arrival_time || null,
      departure_time || null,
      rearrival_time || null,
      received_accessories,
      assignees || [], // Array of user IDs for assignees
      devices?.map((device) => device.device_id) || [], // Array of device IDs
      devices?.map((device) => device.name) || [], // Array of device names
      products?.map((product) => product.amount) || [], // Array of product amounts
      products?.map((product) => product.private_comment || '') || [], // Array of private comments
      products?.map((product) => product.product_name) || [], // Array of product names
      products?.map((product) => product.measure) || [], // Array of measures
      products?.map((product) => product.public_comment || '') || [], // Array of public comments
    ];

    const res = await executeQuery(query, values);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create worksheet' },
        { status: 500 }
      );
    }

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating worksheet:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
