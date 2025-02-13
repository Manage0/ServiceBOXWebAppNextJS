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

export async function POST(req: Request) {
  try {
    const { name, issue_description, work_description } =
      (await req.json()) as {
        name: string;
        issue_description: string;
        work_description: string;
      };

    if (!name) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      );
    }

    await executeQuery(
      'INSERT INTO description_templates (name, issue_description, work_description) VALUES ($1, $2, $3);',
      [name, issue_description, work_description]
    );

    return NextResponse.json(
      { message: 'Template successfully created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
