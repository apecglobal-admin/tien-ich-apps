import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.settings || { backgroundImage: '' });
}

export async function POST(request) {
  const body = await request.json();
  const data = readData();
  
  data.settings = {
    ...data.settings,
    ...body
  };
  
  writeData(data);
  return NextResponse.json({ success: true, settings: data.settings });
}
