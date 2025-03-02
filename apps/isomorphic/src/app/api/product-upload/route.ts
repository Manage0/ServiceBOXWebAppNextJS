import { executeQuery } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii'
  );
  const [username, password] = credentials.split(':');

  if (
    username !== process.env.AUTH_USER ||
    password !== process.env.AUTH_PASS
  ) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const products = (await req.json()) as Array<{
    id: number;
    stock: number;
    price: number;
    status: string;
    image: string;
    name: string;
    category: string;
    measure: string;
  }>;

  const errors = [];
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      await executeQuery(
        `
          INSERT INTO products (id, stock, price, status, image, name, category, measure)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            stock = EXCLUDED.stock,
            price = EXCLUDED.price,
            status = EXCLUDED.status,
            image = EXCLUDED.image,
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            measure = EXCLUDED.measure
        `,
        [
          product.id,
          product.stock,
          product.price,
          product.status,
          product.image,
          product.name,
          product.category,
          product.measure,
        ]
      );
    } catch (error) {
      errors.push({ index: i, error: (error as Error).message });
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json(
    { message: 'Products uploaded successfully' },
    { status: 200 }
  );
}
