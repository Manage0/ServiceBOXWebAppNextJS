import { executeQuery } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await executeQuery(
      'SELECT id, name, public_comment, private_comment FROM comment_templates;'
    );

    const templates = res.rows;

    if (templates.length === 0) {
      return NextResponse.json(
        { error: 'Comment templates not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching comment templates:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, public_comment, private_comment } = (await req.json()) as {
      name: string;
      public_comment: string;
      private_comment: string;
    };

    if (!name || !public_comment || !private_comment) {
      return NextResponse.json(
        { error: 'Name, public_comment, and private_comment are required' },
        { status: 400 }
      );
    }

    await executeQuery(
      'INSERT INTO comment_templates (name, public_comment, private_comment) VALUES ($1, $2, $3);',
      [name, public_comment, private_comment]
    );

    return NextResponse.json(
      { message: 'Comment template successfully created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment template:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
