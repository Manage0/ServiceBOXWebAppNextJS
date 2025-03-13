import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface WsWsRequest {
  wsid1: number;
  wsid2?: number[];
}

export async function POST(req: NextRequest) {
  try {
    const { wsid1, wsid2 } = (await req.json()) as WsWsRequest;

    if (wsid2 && wsid2.includes(wsid1)) {
      return NextResponse.json(
        { error: 'wsid1 cannot be in wsid2' },
        { status: 400 }
      );
    }

    // Delete existing connections for wsid1 or where wsid1 is wsid2
    const deleteQuery = `
      DELETE FROM ws_ws WHERE wsid1 = $1 OR wsid2 = $1;
    `;
    await executeQuery(deleteQuery, [wsid1]);

    if (wsid2 && wsid2.length > 0) {
      // Insert new connections
      const insertQuery = `
        INSERT INTO ws_ws (wsid1, wsid2)
        VALUES ($1, $2)
        RETURNING id;
      `;

      const insertPromises = wsid2.map((id) =>
        executeQuery(insertQuery, [wsid1, id])
      );

      const insertResults = await Promise.all(insertPromises);

      return NextResponse.json(
        insertResults.map((res) => res.rows[0]),
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: 'Connections removed' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error handling ws_ws connection:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
