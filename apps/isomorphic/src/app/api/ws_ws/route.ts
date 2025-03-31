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

    // Single query to delete existing connections and insert new ones
    const query = `
      WITH deleted_connections AS (
        DELETE FROM ws_ws
        WHERE wsid1 = $1 OR wsid2 = $1
      ),
      inserted_connections AS (
        INSERT INTO ws_ws (wsid1, wsid2)
        SELECT $1, unnest($2::int[])
        RETURNING id
      )
      SELECT 'Connections updated' AS message, COUNT(*) AS inserted_count
      FROM inserted_connections;
    `;

    const result = await executeQuery(query, [wsid1, wsid2 || []]);

    if (wsid2 && wsid2.length > 0) {
      return NextResponse.json(
        {
          message: result.rows[0].message,
          inserted_count: result.rows[0].inserted_count,
        },
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
