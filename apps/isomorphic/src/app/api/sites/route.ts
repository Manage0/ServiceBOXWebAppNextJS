import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await executeQuery('SELECT * FROM sites;');

    const sites = res.rows;

    if (sites.length === 0) {
      return NextResponse.json({ error: 'Sites not found' }, { status: 404 });
    }

    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
