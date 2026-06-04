import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.services || { columns: 3, items: [] });
}

export async function POST(request) {
  const body = await request.json();
  const data = readData();

  if (body._updateColumns !== undefined) {
    data.services = {
      ...data.services,
      columns: Math.min(5, Math.max(1, body._updateColumns)),
    };
    writeData(data);
    return NextResponse.json({ success: true });
  }

  const newItem = {
    id: generateId('svc'),
    name: body.name || '',
    icon: body.icon || '',
    color: body.color || '#f5f5f5',
    iconColor: body.iconColor || '#9e9e9e',
    order: (data.services?.items?.length || 0) + 1,
  };

  data.services = {
    ...data.services,
    items: [...(data.services?.items || []), newItem],
  };
  writeData(data);

  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const data = readData();

  data.services = {
    ...data.services,
    items: (data.services?.items || []).map((s) =>
      s.id === body.id ? { ...s, ...body } : s
    ),
  };
  writeData(data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = readData();

  data.services = {
    ...data.services,
    items: (data.services?.items || []).filter((s) => s.id !== id),
  };
  writeData(data);

  return NextResponse.json({ success: true });
}
