import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    const templateName = params.id;

    const { issue_description, work_description } = (await req.json()) as {
      issue_description: string;
      work_description: string;
    };

    if (!templateName) {
      return NextResponse.json(
        { error: 'Invalid template name' },
        { status: 400 }
      );
    }

    // Single query to check existence and update
    const query = `
      UPDATE description_templates
      SET issue_description = $1, work_description = $2
      WHERE name = $3
      RETURNING id;
    `;
    const values = [issue_description, work_description, templateName];

    const result = await executeQuery(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Template successfully updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
