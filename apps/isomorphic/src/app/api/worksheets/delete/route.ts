import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const { ids }: { ids: number[] } = (await req.json()) as { ids: number[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request, no IDs provided' },
        { status: 400 }
      );
    }

    const res = await executeQuery(
      'DELETE FROM worksheets WHERE id = ANY($1::int[]) RETURNING id',
      [ids]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'No worksheets deleted' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { deletedIds: res.rows.map((row) => row.id) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting worksheets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
