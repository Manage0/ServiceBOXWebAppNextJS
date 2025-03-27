import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    const templateName = params.id;

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

    // Single query to check existence and update
    const query = `
      UPDATE comment_templates
      SET public_comment = $1, private_comment = $2
      WHERE name = $3
      RETURNING id;
    `;
    const values = [public_comment, private_comment, templateName];

    const result = await executeQuery(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Comment template not found' },
        { status: 404 }
      );
    }

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
