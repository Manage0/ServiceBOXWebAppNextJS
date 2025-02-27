import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface ProductsRequest {
  worksheet_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const { worksheet_id } = (await req.json()) as ProductsRequest;

    if (!worksheet_id) {
      return NextResponse.json(
        { error: 'worksheet_id is required' },
        { status: 400 }
      );
    }

    const query = `
      SELECT ws_product.*, products.id AS id
      FROM ws_product
      JOIN products ON ws_product.product_name = products.name
      WHERE ws_product.wsid = $1;
    `;
    const products = await executeQuery(query, [worksheet_id]);

    return NextResponse.json(products.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
