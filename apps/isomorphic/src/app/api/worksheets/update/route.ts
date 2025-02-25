import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';
import { WorksheetFormTypes } from '@/validators/worksheet.schema';

// PATCH: Update signage, signage_date, and signing_person for a worksheet by ID
export async function PATCH(request: Request) {
  try {
    const { signage, signage_date, signing_person, id } =
      (await request.json()) as Partial<
        Pick<
          WorksheetFormTypes,
          'signage' | 'signage_date' | 'signing_person' | 'id'
        >
      >;

    if (!id) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    if (!signage || !signage_date || !signing_person) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE worksheets
      SET signage = $1, signage_date = $2, signing_person = $3
      WHERE id = $4
      RETURNING *;
    `;

    const res = await executeQuery(query, [
      signage,
      signage_date,
      signing_person,
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating worksheet signage:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
