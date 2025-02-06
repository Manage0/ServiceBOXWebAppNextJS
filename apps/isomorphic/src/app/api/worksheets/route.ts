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
    const data: WorksheetFormTypes =
      (await request.json()) as WorksheetFormTypes;

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
    } = data;

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
        private_comment
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      ) RETURNING *;
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
    ];

    const res = await executeQuery(query, values);

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating worksheet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
