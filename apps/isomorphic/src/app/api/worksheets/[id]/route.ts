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
      signage_date,
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
      assignees, // Handle assignees separately
    } = data;

    const query = `
      UPDATE worksheets
      SET completion_date = $1, handover_date = $2, priority = $3, status = $4, 
          invoice_date = $5, signage_date = $6, deadline_date = $7, country = $8, 
          postal_code = $9, city = $10, address = $11, tax_num = $12, email = $13, 
          partner_name = $14, company_name = $15, company_address = $16, 
          company_tax_num = $17, jira_ticket_num = $18, invoice_number = $19, 
          procurement_po = $20, issue_description = $21, work_description = $22, 
          public_comment = $23, private_comment = $24, partner_id = $25, 
          site_id = $26, start_time = $27, arrival_time = $28, departure_time = $29, 
          rearrival_time = $30
      WHERE id = $31
      RETURNING *;
    `;

    const values = [
      completion_date,
      handover_date,
      priority,
      status,
      invoice_date,
      signage_date,
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
