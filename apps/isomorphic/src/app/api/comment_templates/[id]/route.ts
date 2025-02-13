import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    const templateName = params.id; // ✅ Use `name` instead of `id`

    console.log('Received Name:', templateName); // Debugging output

    const { public_comment, private_comment } = (await req.json()) as {
      public_comment: string;
      private_comment: string;
    };

    if (!templateName) {
      return NextResponse.json(
        { error: 'Invalid template name' },
        { status: 400 }
      );
    }

    // Check if the comment template exists
    const existingTemplate = await executeQuery(
      'SELECT id FROM comment_templates WHERE name = $1;',
      [templateName] // ✅ Query by name
    );

    if (existingTemplate.rows.length === 0) {
      return NextResponse.json(
        { error: 'Comment template not found' },
        { status: 404 }
      );
    }

    // Update the template using `name` as the identifier
    await executeQuery(
      'UPDATE comment_templates SET public_comment = $1, private_comment = $2 WHERE name = $3;',
      [public_comment, private_comment, templateName] // ✅ Use name in WHERE clause
    );

    return NextResponse.json(
      { message: 'Comment template successfully updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating comment template:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
