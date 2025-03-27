import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const { id } = (await req.json()) as { id: string };

    if (!id) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    // Fetch worksheet details
    const worksheetRes = await executeQuery(
      `SELECT * FROM worksheets WHERE id = $1`,
      [id]
    );

    if (worksheetRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    const worksheet = worksheetRes.rows[0];

    // Fetch assignees
    const assigneesRes = await executeQuery(
      `SELECT ws_assignees.user_id FROM ws_assignees WHERE ws_assignees.wsid = $1`,
      [id]
    );
    worksheet.assignees = assigneesRes.rows.map((row) => row.user_id);

    // Fetch related worksite
    const siteRes = await executeQuery(
      `SELECT * FROM sites WHERE site_id = $1`,
      [worksheet.site_id]
    );
    worksheet.site = siteRes.rows[0] || null;

    // Fetch related partner
    const partnerRes = await executeQuery(
      `SELECT * FROM partners WHERE id = $1`,
      [worksheet.partner_id]
    );
    worksheet.partner = partnerRes.rows[0] || null;

    // Fetch connected worksheet ID
    const connectionRes = await executeQuery(
      `SELECT 
          CASE 
            WHEN wsid1 = $1 THEN wsid2
            WHEN wsid2 = $1 THEN wsid1
          END AS connected_worksheet
       FROM ws_ws 
       WHERE wsid1 = $1 OR wsid2 = $1`,
      [id]
    );

    worksheet.connected_worksheet_id = connectionRes.rows.length
      ? connectionRes.rows[0].connected_worksheet
      : null;

    // Fetch devices
    const devicesRes = await executeQuery(
      `SELECT id, wsid, device_id, device_name AS name FROM ws_device WHERE wsid = $1`,
      [id]
    );
    worksheet.devices = devicesRes.rows;

    return NextResponse.json(worksheet, { status: 200 });
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
