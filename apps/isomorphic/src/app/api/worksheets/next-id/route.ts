import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function GET() {
  try {
    // Lekérdezzük a legutolsó worksheet_id-t
    const res = await executeQuery(`
      SELECT worksheet_id 
      FROM worksheets 
      WHERE worksheet_id IS NOT NULL
      ORDER BY id DESC 
      LIMIT 1;
    `);

    // Ha nincs worksheet_id, kezdjük az elsővel
    const lastWorksheetId = res.rows[0]?.worksheet_id || '2025/00000';

    // Szétválasztjuk az év és a sorszám részt
    const [year, number] = lastWorksheetId.split('/');
    const nextNumber = String(parseInt(number, 10) + 1).padStart(5, '0'); // Növeljük a sorszámot és nullákkal töltjük ki
    const nextWorksheetId = `${year}/${nextNumber}`;

    return NextResponse.json({ nextWorksheetId }, { status: 200 });
  } catch (error) {
    console.error('Error fetching next worksheet ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next worksheet ID' },
      { status: 500 }
    );
  }
}
