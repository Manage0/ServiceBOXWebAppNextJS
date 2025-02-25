import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

export async function GET() {
  try {
    const res = await executeQuery('SELECT * FROM worksheets;');

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'No worksheets found' },
        { status: 404 }
      );
    }

    // Append a badge with 50% chance of being "Új" or null
    const worksheetsWithBadge = res.rows.map((worksheet) => ({
      ...worksheet,
      badge: Math.random() < 0.5 ? 'Új' : null,
    }));

    return NextResponse.json(worksheetsWithBadge, { status: 200 });
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
      creation_date,
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
      assignees, // Add assignees to destructured data
      devices, // Add devices to destructured data
      products, // Add products to destructured data
    } = data;

    // Ensure partner_id and site_id are not null
    if (!partner_id) {
      throw new Error('partner_id is required');
    }
    if (!site_id) {
      throw new Error('site_id is required');
    }

    const query = `
      INSERT INTO worksheets (
        completion_date,
        handover_date,
        priority,
        creation_date,
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
        rearrival_time
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
      ) RETURNING id;
    `;

    const values = [
      completion_date,
      handover_date,
      priority,
      creation_date,
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
    ];

    const res = await executeQuery(query, values);
    const worksheetId = res.rows[0].id;

    // Insert assignees into ws_assignees table
    if (assignees && assignees.length > 0) {
      const assigneeQueries = assignees.map((assignee) => {
        return executeQuery(
          `
          INSERT INTO ws_assignees (wsid, seen, user_id)
          VALUES ($1, $2, $3);
        `,
          [worksheetId, false, assignee]
        );
      });

      await Promise.all(assigneeQueries);
    }

    // Insert devices into ws_device table
    if (devices && devices.length > 0) {
      const deviceQueries = devices.map((device) => {
        return executeQuery(
          `
          INSERT INTO ws_device (wsid, device_id, device_name)
          VALUES ($1, $2, $3);
        `,
          [worksheetId, device.id, device.name]
        );
      });

      await Promise.all(deviceQueries);
    }

    // Insert products into ws_product table
    if (products && products.length > 0) {
      const productQueries = products.map((product) => {
        return executeQuery(
          `
          INSERT INTO ws_product (
            wsid,
            amount,
            private_comment,
            product_name,
            measure,
            public_comment
          ) VALUES ($1, $2, $3, $4, $5, $6);
        `,
          [
            worksheetId,
            product.amount,
            product.private_comment,
            product.product_name,
            product.measure,
            product.public_comment,
          ]
        );
      });

      await Promise.all(productQueries);
    }

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating worksheet:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
