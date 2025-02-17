import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface WsWsRequest {
  wsid1: number;
  wsid2: number;
}

export async function POST(req: NextRequest) {
  try {
    const { wsid1, wsid2 } = (await req.json()) as WsWsRequest;

    if (wsid1 === wsid2) {
      return NextResponse.json(
        { error: 'wsid1 and wsid2 cannot be the same' },
        { status: 400 }
      );
    }

    // Check if a connection already exists for wsid1
    const existingConnectionQuery = `
      SELECT wsid2 FROM ws_ws WHERE wsid1 = $1;
    `;
    const existingConnectionRes = await executeQuery(existingConnectionQuery, [
      wsid1,
    ]);

    if (existingConnectionRes.rows.length > 0) {
      const currentWsid2 = existingConnectionRes.rows[0].wsid2;

      // If the connection has changed, update it
      if (currentWsid2 !== wsid2) {
        const updateQuery = `
          UPDATE ws_ws
          SET wsid2 = $1
          WHERE wsid1 = $2
          RETURNING id;
        `;
        const updateRes = await executeQuery(updateQuery, [wsid2, wsid1]);
        return NextResponse.json(updateRes.rows[0], { status: 200 });
      } else {
        // Connection already exists and hasn't changed
        return NextResponse.json(
          { message: 'No changes needed' },
          { status: 200 }
        );
      }
    }

    // If no existing connection, insert a new one
    const insertQuery = `
      INSERT INTO ws_ws (wsid1, wsid2)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const insertRes = await executeQuery(insertQuery, [wsid1, wsid2]);

    return NextResponse.json(insertRes.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error handling ws_ws connection:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
