import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';

// Unified sections API
export async function GET() {
  const data = readData();
  return NextResponse.json(data.sections || []);
}

export async function POST(request) {
  const body = await request.json();
  const data = readData();

  // Create new section
  const newSection = {
    id: generateId('section'),
    title: body.title || '',
    headerLink: body.headerLink || '',
    headerLinkType: body.headerLinkType || 'none',
    headerLinkUrl: body.headerLinkUrl || '',
    headerPopupImage: body.headerPopupImage || '',
    columns: Math.min(5, Math.max(1, body.columns || 3)),
    showAddButton: body.showAddButton || false,
    order: (data.sections?.length || 0) + 1,
    items: [],
  };

  data.sections = [...(data.sections || []), newSection];
  writeData(data);

  return NextResponse.json(newSection, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const data = readData();

  data.sections = (data.sections || []).map((s) =>
    s.id === body.id ? { ...s, ...body, items: body.items !== undefined ? body.items : s.items } : s
  );
  writeData(data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = readData();

  data.sections = (data.sections || []).filter((s) => s.id !== id);
  writeData(data);

  return NextResponse.json({ success: true });
}
