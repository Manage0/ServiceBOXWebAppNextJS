import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function GET() {
  try {
    const res = await executeQuery('SELECT * FROM worksheets;');

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'No worksheets found' },
        { status: 404 }
      );
    }

    // Append a badge with 50% chance of being "Új" or null
    const worksheetsWithBadge = res.rows.map((worksheet) => ({
      ...worksheet,
      badge: Math.random() < 0.5 ? 'Új' : null,
    }));

    return NextResponse.json(worksheetsWithBadge, { status: 200 });
  } catch (error) {
    console.error('Error fetching worksheets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
