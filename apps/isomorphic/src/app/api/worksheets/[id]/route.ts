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
      received_accessories, // Handle received_accessories
      assignees, // Handle assignees separately
      devices, // Handle devices separately
      products, // Handle products separately
    } = data;

    const query = `
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
      RETURNING *;
    `;

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
      received_accessories, // Add received_accessories to the values array
      id,
    ];

    const res = await executeQuery(query, values);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    // Update assignees in ws_assignees table
    if (assignees && assignees.length > 0) {
      // Remove existing assignees
      await executeQuery('DELETE FROM ws_assignees WHERE wsid = $1;', [id]);

      // Insert updated assignees
      const assigneeQueries = assignees.map((assignee) => {
        return executeQuery(
          'INSERT INTO ws_assignees (wsid, seen, user_id) VALUES ($1, $2, $3);',
          [id, false, assignee]
        );
      });

      await Promise.all(assigneeQueries);
    }

    // Update devices in ws_device table
    if (devices && devices.length > 0) {
      // Remove existing devices
      await executeQuery('DELETE FROM ws_device WHERE wsid = $1;', [id]);

      // Insert updated devices
      const deviceQueries = devices.map((device) => {
        return executeQuery(
          'INSERT INTO ws_device (wsid, device_id, device_name) VALUES ($1, $2, $3);',
          [id, device.device_id, device.name]
        );
      });

      await Promise.all(deviceQueries);
    }

    // Update products in ws_product table
    if (products && products.length > 0) {
      // Remove existing products
      await executeQuery('DELETE FROM ws_product WHERE wsid = $1;', [id]);

      // Insert updated products
      const productQueries = products.map((product) => {
        return executeQuery(
          'INSERT INTO ws_product (wsid, product_name, amount, measure, public_comment, private_comment) VALUES ($1, $2, $3, $4, $5, $6);',
          [
            id,
            product.product_name,
            product.amount,
            product.measure,
            product.public_comment,
            product.private_comment,
          ]
        );
      });

      await Promise.all(productQueries);
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
