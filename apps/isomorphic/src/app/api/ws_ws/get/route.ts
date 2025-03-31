import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface GetWsWsRequest {
  worksheet_id: number;
}

export async function POST(req: NextRequest) {
  try {
    const { worksheet_id } = (await req.json()) as GetWsWsRequest;

    // Single query to fetch all connected worksheet IDs
    const query = `
      SELECT DISTINCT 
        CASE 
          WHEN wsid1 = $1 THEN wsid2
          WHEN wsid2 = $1 THEN wsid1
        END AS connected_id
      FROM ws_ws
      WHERE wsid1 = $1 OR wsid2 = $1;
    `;

    const result = await executeQuery(query, [worksheet_id]);

    // Extract connected worksheet IDs
    const connectedWorksheetIds = result.rows.map(
      (row: { connected_id: number }) => row.connected_id
    );

    return NextResponse.json(connectedWorksheetIds, { status: 200 });
  } catch (error) {
    console.error('Error fetching connected worksheets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
