import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface WsWsRequest {
  wsid1: number;
  wsid2: number[];
}

export async function POST(req: NextRequest) {
  try {
    const { wsid1, wsid2 } = (await req.json()) as WsWsRequest;

    if (wsid2.includes(wsid1)) {
      return NextResponse.json(
        { error: 'wsid1 cannot be in wsid2' },
        { status: 400 }
      );
    }

    // Delete existing connections for wsid1
    const deleteQuery = `
      DELETE FROM ws_ws WHERE wsid1 = $1;
    `;
    await executeQuery(deleteQuery, [wsid1]);

    // Check existing connections
    const checkQuery = `
      SELECT wsid2 FROM ws_ws WHERE wsid1 = $1;
    `;
    const existingConnections = await executeQuery(checkQuery, [wsid1]);
    const existingWsids = existingConnections.rows.map(
      (row: { wsid2: number }) => row.wsid2
    );

    // Insert new connections if they don't already exist
    const insertQuery = `
      INSERT INTO ws_ws (wsid1, wsid2)
      VALUES ($1, $2)
      RETURNING id;
    `;

    const insertPromises = wsid2
      .filter((id) => !existingWsids.includes(id))
      .map((id) => executeQuery(insertQuery, [wsid1, id]));

    const insertResults = await Promise.all(insertPromises);

    return NextResponse.json(
      insertResults.map((res) => res.rows[0]),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling ws_ws connection:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
