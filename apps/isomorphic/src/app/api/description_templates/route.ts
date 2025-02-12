import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await executeQuery(
      'SELECT id, name, issue_description, work_description FROM description_templates;'
    );

    const templates = res.rows;

    if (templates.length === 0) {
      return NextResponse.json(
        { error: 'Templates not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
