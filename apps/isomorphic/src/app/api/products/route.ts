import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function GET() {
  try {
    const res = await executeQuery(
      'SELECT p.id, p.name, p.category, p.image, p.stock, p.price, p.status, p.measure FROM products p;'
    );

    const products = res.rows;
    if (products.length === 0) {
      return NextResponse.json(
        { error: 'products not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
