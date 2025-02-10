import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface WsWsRequest {
  wsid1: number;
  wsid2: number;
}

export async function POST(req: NextRequest) {
  try {
    const { wsid1, wsid2 } = (await req.json()) as WsWsRequest;

    // Validate that wsid1 and wsid2 are not the same
    if (wsid1 === wsid2) {
      return NextResponse.json(
        { error: 'wsid1 and wsid2 cannot be the same' },
        { status: 400 }
      );
    }

    // Insert the connection into the ws_ws table
    const query = `
      INSERT INTO ws_ws (wsid1, wsid2)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const values = [wsid1, wsid2];

    const res = await executeQuery(query, values);

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating ws_ws connection:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
