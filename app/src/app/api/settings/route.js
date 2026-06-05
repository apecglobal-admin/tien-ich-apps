import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.settings || { backgroundImage: '' });
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();
    
    data.settings = {
      ...data.settings,
      ...body
    };
    
    writeData(data);
    return NextResponse.json({ success: true, settings: data.settings });
  } catch (error) {
    console.error('POST settings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
