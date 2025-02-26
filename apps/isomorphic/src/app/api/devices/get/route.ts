import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/db';

interface DevicesRequest {
  worksheet_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const { worksheet_id } = (await req.json()) as DevicesRequest;

    if (!worksheet_id) {
      return NextResponse.json(
        { error: 'worksheet_id is required' },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM ws_device WHERE wsid = $1;
    `;
    const devices = await executeQuery(query, [worksheet_id]);

    // Rename device_name to name
    const transformedDevices = devices.rows.map((device) => ({
      ...device,
      name: device.device_name,
      device_name: undefined, // Remove the original device_name field
    }));

    return NextResponse.json(transformedDevices, { status: 200 });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
