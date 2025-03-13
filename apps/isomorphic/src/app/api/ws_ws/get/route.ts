import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface GetWsWsRequest {
  worksheet_id: number;
}

export async function POST(req: NextRequest) {
  try {
    const { worksheet_id } = (await req.json()) as GetWsWsRequest;

    const query1 = `
      SELECT wsid2 as connected_id FROM ws_ws WHERE wsid1 = $1;
    `;
    const query2 = `
      SELECT wsid1 as connected_id FROM ws_ws WHERE wsid2 = $1;
    `;

    const [result1, result2] = await Promise.all([
      executeQuery(query1, [worksheet_id]),
      executeQuery(query2, [worksheet_id]),
    ]);

    const connectedWorksheetIds = [
      ...result1.rows.map((row: { connected_id: number }) => row.connected_id),
      ...result2.rows.map((row: { connected_id: number }) => row.connected_id),
    ];

    // Remove duplicates
    const uniqueConnectedWorksheetIds = Array.from(
      new Set(connectedWorksheetIds)
    );

    return NextResponse.json(uniqueConnectedWorksheetIds, { status: 200 });
  } catch (error) {
    console.error('Error fetching connected worksheets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
