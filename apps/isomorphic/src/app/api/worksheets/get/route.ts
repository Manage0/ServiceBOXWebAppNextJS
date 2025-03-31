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

    // Single query to fetch all required data
    const query = `
      WITH worksheet_data AS (
        SELECT * FROM worksheets WHERE id = $1
      ),
      assignees_data AS (
        SELECT json_agg(user_id) AS assignees
        FROM ws_assignees WHERE wsid = $1
      ),
      devices_data AS (
        SELECT json_agg(json_build_object('id', id, 'wsid', wsid, 'device_id', device_id, 'name', device_name)) AS devices
        FROM ws_device WHERE wsid = $1
      ),
      products_data AS (
        SELECT json_agg(json_build_object(
          'id', products.id,
          'wsid', ws_product.wsid,
          'product_name', ws_product.product_name,
          'amount', ws_product.amount,
          'measure', ws_product.measure,
          'public_comment', ws_product.public_comment,
          'private_comment', ws_product.private_comment
        )) AS products
        FROM ws_product
        JOIN products ON ws_product.product_name = products.name
        WHERE ws_product.wsid = $1
      ),
      connected_ws_data AS (
        SELECT 
          json_agg(
            CASE 
              WHEN wsid1 = $1 THEN wsid2
              WHEN wsid2 = $1 THEN wsid1
            END
          ) AS connected_worksheets
        FROM ws_ws 
        WHERE wsid1 = $1 OR wsid2 = $1
      ),
      site_data AS (
        SELECT row_to_json(sites) AS site
        FROM sites
        WHERE site_id = (SELECT site_id FROM worksheet_data)
      ),
      partner_data AS (
        SELECT row_to_json(partners) AS partner
        FROM partners
        WHERE id = (SELECT partner_id FROM worksheet_data)
      )
      SELECT 
        (SELECT row_to_json(w) FROM worksheet_data w) AS worksheet,
        (SELECT assignees FROM assignees_data) AS assignees,
        (SELECT devices FROM devices_data) AS devices,
        (SELECT products FROM products_data) AS products,
        (SELECT connected_worksheets FROM connected_ws_data) AS connected_worksheets,
        (SELECT site FROM site_data) AS site,
        (SELECT partner FROM partner_data) AS partner;
    `;

    const worksheetRes = await executeQuery(query, [id]);

    if (worksheetRes.rows.length === 0 || !worksheetRes.rows[0].worksheet) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    // Combine all data into a single response object
    const worksheet = worksheetRes.rows[0].worksheet;
    worksheet.assignees = worksheetRes.rows[0].assignees || [];
    worksheet.devices = worksheetRes.rows[0].devices || [];
    worksheet.products = worksheetRes.rows[0].products || [];
    worksheet.connected_worksheet_id =
      worksheetRes.rows[0].connected_worksheet || null;
    worksheet.site = worksheetRes.rows[0].site || null;
    worksheet.partner = worksheetRes.rows[0].partner || null;

    return NextResponse.json(worksheet, { status: 200 });
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
