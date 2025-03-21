import { NextResponse } from 'next/server';
import { executeQuery } from '@/db';

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const worksheetId = formData.get('worksheetId');

    if (!worksheetId) {
      return NextResponse.json(
        { error: 'worksheetId is required' },
        { status: 400 }
      );
    }

    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const imageQueries = [];

    for (const image of images) {
      // Convert the image to a Base64 string
      const buffer = Buffer.from(await image.arrayBuffer());
      const base64Image = buffer.toString('base64');

      // Insert the Base64 image into the database
      imageQueries.push(
        executeQuery(
          `
          INSERT INTO ws_images (wsid, image_base64)
          VALUES ($1, $2);
        `,
          [worksheetId, base64Image]
        )
      );
    }

    // Execute all image insert queries
    await Promise.all(imageQueries);

    return NextResponse.json(
      { message: 'Images uploaded successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
