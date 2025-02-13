import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    const templateName = params.id; // ✅ Use `name` instead of `id`

    console.log('Received Name:', templateName); // Debugging output

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

    // Check if the template exists
    const existingTemplate = await executeQuery(
      'SELECT id FROM description_templates WHERE name = $1;',
      [templateName] // ✅ Query by name
    );

    if (existingTemplate.rows.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Update the template using `name` as identifier
    await executeQuery(
      'UPDATE description_templates SET issue_description = $1, work_description = $2 WHERE name = $3;',
      [issue_description, work_description, templateName] // ✅ Use name in WHERE clause
    );

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
