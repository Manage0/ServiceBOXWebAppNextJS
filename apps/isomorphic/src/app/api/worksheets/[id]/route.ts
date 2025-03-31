import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

// GET: Retrieve a single worksheet by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const res = await executeQuery('SELECT * FROM worksheets WHERE id = $1;', [
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT: Update a worksheet by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      partner_name,
      company_name,
      company_address,
      company_tax_num,
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
      received_accessories,
      assignees,
      devices,
      products,
    } = data;

    // Ensure all arrays are properly typed
    const assigneeIds = assignees || []; // Convert to integer array
    const deviceIds = devices?.map((device) => device.device_id) || [];
    const deviceNames = devices?.map((device) => device.name) || [];
    const productNames = products?.map((product) => product.product_name) || [];
    const productAmounts = products?.map((product) => product.amount) || [];
    const productMeasures = products?.map((product) => product.measure) || [];
    const productPublicComments =
      products?.map((product) => product.public_comment) || [];
    const productPrivateComments =
      products?.map((product) => product.private_comment) || [];

    // Single query to update worksheet and related tables
    const query = `
      WITH updated_worksheet AS (
        UPDATE worksheets
        SET completion_date = $1, handover_date = $2, priority = $3, status = $4, 
            invoice_date = $5, deadline_date = $6, country = $7, 
            postal_code = $8, city = $9, address = $10, tax_num = $11, email = $12, 
            partner_name = $13, company_name = $14, company_address = $15, 
            company_tax_num = $16, jira_ticket_num = $17, invoice_number = $18, 
            procurement_po = $19, issue_description = $20, work_description = $21, 
            public_comment = $22, private_comment = $23, partner_id = $24, 
            site_id = $25, start_time = $26, arrival_time = $27, departure_time = $28, 
            rearrival_time = $29, received_accessories = $30
        WHERE id = $31
        RETURNING id
      ),
      deleted_assignees AS (
        DELETE FROM ws_assignees WHERE wsid = $31
      ),
      inserted_assignees AS (
        INSERT INTO ws_assignees (wsid, seen, user_id)
        SELECT $31, false, unnest($32::text[])
      ),
      deleted_devices AS (
        DELETE FROM ws_device WHERE wsid = $31
      ),
      inserted_devices AS (
        INSERT INTO ws_device (wsid, device_id, device_name)
        SELECT $31, unnest($33::text[]), unnest($34::text[])
      ),
      deleted_products AS (
        DELETE FROM ws_product WHERE wsid = $31
      ),
      inserted_products AS (
        INSERT INTO ws_product (wsid, product_name, amount, measure, public_comment, private_comment)
        SELECT $31, unnest($35::text[]), unnest($36::int[]), unnest($37::text[]), unnest($38::text[]), unnest($39::text[])
      )
      SELECT * FROM updated_worksheet;
    `;

    // Prepare values for the query
    const values = [
      completion_date || null,
      handover_date || null,
      priority,
      status,
      invoice_date,
      deadline_date || null,
      country,
      postal_code,
      city,
      address,
      tax_num,
      email,
      partner_name,
      company_name,
      company_address,
      company_tax_num,
      jira_ticket_num || '',
      invoice_number || '',
      procurement_po || '',
      issue_description || '',
      work_description || '',
      public_comment || '',
      private_comment || '',
      partner_id,
      site_id,
      start_time || null,
      arrival_time || null,
      departure_time || null,
      rearrival_time || null,
      received_accessories,
      id,
      assigneeIds, // Array of assignee IDs (integer)
      deviceIds, // Array of device IDs (integer)
      deviceNames, // Array of device names (text)
      productNames, // Array of product names (text)
      productAmounts, // Array of product amounts (integer)
      productMeasures, // Array of product measures (text)
      productPublicComments, // Array of product public comments (text)
      productPrivateComments, // Array of product private comments (text)
    ];

    const res = await executeQuery(query, values);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating worksheet:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove a worksheet by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete worksheet and associated assignees
    await executeQuery('DELETE FROM ws_assignees WHERE wsid = $1;', [id]);
    const res = await executeQuery(
      'DELETE FROM worksheets WHERE id = $1 RETURNING *;',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Worksheet deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting worksheet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
